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
import { ObjectId } from "mongoose";
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
            { fullName: 1, userName: 1, avater: 1, _id: 1 }
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
          { fullName: 1, userName: 1, avater: 1, _id: 1 }
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
    console.log(data,"initial form data")
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
    const S3= new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.S3_ACCESS_KEY,
        // destinationBucketName: "po",
        region: process.env.S3_BUCKET_REGION,
      })

    // ASW code start

    // const base64data = Buffer.from(body, "binary");
    const randomImageName = (byte = 32) => crypto.randomBytes(byte).toString("hex");
    let params = {
      Bucket: "poshvid",
      Key: `${randomImageName}.mp4`,
      ContentType: "mp4",
      Body: data.file,
//      ACL: "public-read",
    };
    try {
      let uploadPromise = await S3.putObject(params).promise();
      console.log("Successfully uploaded data to bucket",uploadPromise)

// S3.upload(params,(error:any,data:any)=>{
//   if(error){
//     console.log(error,"error")
//     return error.message
//   }
//   console.log("Successfully uploaded data to bucket",data)
  return "Successfully uploaded data to bucket"
// })
      // console.log("Successfully uploaded data to bucket", uploadPromise);
      // console.log(
      //   `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`
      // );
    } catch (e) {
      console.log("Error uploading data: ", e);
    }
  }
  async likePost({ _id }: { _id: ObjectId }, person: loggedInInterface) {
    await this.isLoggedin(person);
    let newPostCount = await __Post
      .findByIdAndUpdate(_id, { $inc: { likes: 1 } }, { new: true })
      .select({ likes: 1 });
    return { likes: newPostCount };
  }
  async postsforYou(person: loggedInInterface) {
    await this.isLoggedin(person);
  }
  async followingPosts(person: loggedInInterface) {
    await this.isLoggedin(person);
    let userFollowing: any = await __User
      .findById(person._id)
      .select("following");
    return await __Post
      .find({ user: { $in: userFollowing } })
      .sort({ likes: 1 });
  }
}

export default PostDataSource;
