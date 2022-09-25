import Base from "../../base";
import __Person from "../../models/person";
import __Hashtag from "../../models/hashtag";
import __User from "../../models/user";
import __Post from "../../models/post";
import { createPostType, QueryPathEnum } from "./interface";
import { loggedInInterface } from "../auth/interface";
import { PersonM } from "../../interface/db";
import Paginate from "../../utils/lib/paginate";
import getHashtags from "../../utils/lib/hashTags";
import AWS from "aws-sdk";
import crypto from "crypto";
import mongoose, { ObjectId, Schema } from "mongoose";
// import mongoose from "mongoose"
import { AWSS3Uploader } from "../../utils/lib/awsUploader";
class PostDataSource extends Base {
  async query(
    {
      data: { key, path, page, limit },
    }: {
      data: { key: string; path: QueryPathEnum; page: number; limit: number };
    },
    person: loggedInInterface
  ) {
    switch (path) {
      case QueryPathEnum.TOP:
        let user: PersonM[];
        let hashTags: never[];
        let Videos: [];
        user = await __Person
          .find(
            {
              $or: [
                { fullName: { $regex: key, $options: "i" } },
                { userName: { $regex: key, $options: "i" } },
              ],
            },
            { fullName: 1, userName: 1, avater: 1, _id: 0, user: 1 }
          )
          .limit(2);
        hashTags = await __Post.find({
          hastag: { $in: { $regex: key, $options: "i" } },
        });
        // Videos = await (__Post as any).search({query_string:{query:key}}, { hydrate:true })
        return {
          // Videos,
          user,
          hashTags,
        };
      case QueryPathEnum.USER:
        let response: any = await __Person.find(
          {
            $or: [
              { fullName: { $regex: key, $options: "i" } },
              { userName: { $regex: key, $options: "i" } },
            ],
          },
          { fullName: 1, userName: 1, avater: 1, user: 1, _id: 0 }
        );
        return Paginate(response, page, limit);
      case QueryPathEnum.HASHTAG:
        let hashResponse: any = await __Post.find({
          hastag: { $in: { $regex: key, $options: "i" } },
        });
        return Paginate(hashResponse, page, limit);

      case QueryPathEnum.VIDEO:
        let videoResponse: any = await __Post.find({
          tags: { $in: { $regex: key, $options: "i" } },
        });
        return Paginate(videoResponse, page, limit);

      default:
    }
  }
  async createPost(data: createPostType, person: loggedInInterface) {
    await this.isLoggedin(person);
    const postHashTags = getHashtags(data?.caption || "");
    // const { stream, filename, mimetype, encoding } = await data.file;
    // console.log(stream, filename, mimetype, encoding);
    // const s3Uploader = new AWSS3Uploader({
    //   accessKeyId: process.env.AWS_ACCESS_KEY,
    //   secretAccessKey: process.env.S3_ACCESS_KEY,
    //   destinationBucketName: process.env.S3_BUCKET_NAME,
    //   region: process.env.S3_BUCKET_REGION,
    // });
    // Do work 💪
    // await s3Uploader.Upload(data.file)
    //     const S3= new AWS.S3({
    //         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //         // destinationBucketName: "po",
    //         region: process.env.S3_BUCKET_REGION,
    //       })

    //     // ASW code start

    //     // const base64data = Buffer.from(body, "binary");
    //     const randomImageName = (byte = 32) => crypto.randomBytes(byte).toString("hex");
    //     let params = {
    //       Bucket: "poshvid",
    //       Key: `${randomImageName}.mp4`,
    //       ContentType: "mp4",
    //       Body: data.file,
    // //      ACL: "public-read",
    //     };
    //     try {
    //       let uploadPromise = await S3.putObject(params).promise();
    //       console.log("Successfully uploaded data to bucket",uploadPromise)

    //   return "Successfully uploaded data to bucket"
    //       //   `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`

    //     } catch (e) {
    //       console.log("Error uploading data: ", e);
    //     }
  }
  async likePost({ _id }: { _id: ObjectId }, person: loggedInInterface) {
    await this.isLoggedin(person);
    let postLikes: any = await __Post.findById(_id);
    let isLiked: any = await __Person.findOne({ $and: [{ user:person._id }, { likedPosts: { $in: _id } }]});
    if (!isLiked) {
      await __Person.findOneAndUpdate({user:person._id},{$push:{likedPosts:_id}})
      postLikes.likes += 1;
       await postLikes.save();
      return { likes: postLikes.likes };
    } else {
      return { likes: postLikes.likes };
    }
  }
  async hasLikedPost({ _id }: { _id: ObjectId }, person: loggedInInterface){
    await this.isLoggedin(person);
    let isLiked = await __Person.findOne({user:person._id,likedPosts:{$in:_id}})
     return isLiked ? true :false
    
  }
  async viewPost({ _id }: { _id: ObjectId }, person: loggedInInterface){
    await this.isLoggedin(person);
     await __Post.findByIdAndUpdate(_id,{$inc:{views:1}})
     return "viewed"
    
  }
  async getPostsForYou(
    { data }: { data: { page: number; limit: number } },
    person: loggedInInterface
  ) {
    await this.isLoggedin(person);
    let dataLimit = data.limit;
    let dataPage = data.page - 1;
    return await __Post.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: "people",
          localField: "user",
          foreignField: "user",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $limit: dataLimit,
      },
      {
        $skip: dataLimit * dataPage,
      },
      {
        $sort: {
          likes: -1,
          views: -1,
          comments: -1,
        },
      },
    ]);
  }
  async getFollowingPosts(
    { data }: { data: { page: number; limit: number } },
    person: loggedInInterface
  ) {
    await this.isLoggedin(person);
    let dataLimit = data.limit;
    let dataPage = data.page - 1;
    let { following = [] }: any = await __Person
      .findOne({ user: person._id })
      .select({ following: 1, _id: 0 });

    return await __Post.aggregate([
      {
        $match: {
          user: { $in: following },
        },
      },
      {
        $lookup: {
          from: "people",
          localField: "user",
          foreignField: "user",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $limit: dataLimit,
      },
      {
        $skip: dataLimit * dataPage,
      },
      {
        $sort: {
          views: -1,
          likes: -1,
          comments: -1,
        },
      },
    ]);
  }
  async getLikedPosts(
    { data }: { data: { page: number; limit: number } },
    person: loggedInInterface
  ) {
    await this.isLoggedin(person);
    let dataLimit = data.limit;
    let dataPage = data.page - 1;
    let { likedPosts = [] }: any = await __Person
      .findOne({ user: person._id })
      .select({ likedPosts: 1, _id: 0 });
    return await __Post.aggregate([
      {
        $match: {
          _id: { $in: likedPosts },
        },
      },
      {
        $lookup: {
          from: "people",
          localField: "user",
          foreignField: "user",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $limit: dataLimit,
      },
      {
        $skip: dataLimit * dataPage,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
  }

  async getFriendsPosts(
    { data }: { data: { page: number; limit: number } },
    person: loggedInInterface
  ) {
    await this.isLoggedin(person);
    let dataLimit = data.limit;
    let dataPage = data.page - 1;
    let { following = [], followers = [] }: any = await __Person
      .findOne({ user: person._id })
      .select({ following: 1, followers: 1, _id: 0 });

    let friends = await following.filter((_id: any) =>
      followers.some((id: any) => _id.toString() === id.toString())
    );
    return await __Post.aggregate([
      {
        $match: {
          user: { $in: friends },
        },
      },
      {
        $lookup: {
          from: "people",
          localField: "user",
          foreignField: "user",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $limit: dataLimit,
      },
      {
        $skip: dataLimit * dataPage,
      },
      {
        $sort: {
          views: -1,
          likes: -1,
          comments: -1,
        },
      },
    ]);
  }
  async getUserPosts(
    { data }: { data: { page: number; limit: number } },
    person: loggedInInterface
  ) {
    await this.isLoggedin(person);
    let dataLimit = data.limit;
    let dataPage = data.page - 1;

    let id = new mongoose.Types.ObjectId(person._id as any);

    return await __Post.aggregate([
      {
        $match: {
          user: id,
        },
      },
      {
        $lookup: {
          from: "people",
          localField: "user",
          foreignField: "user",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $limit: dataLimit,
      },
      {
        $skip: dataLimit * dataPage,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
  }
}

export default PostDataSource;
