import { Request, Response, NextFunction } from "express";
import __Post from "../models/post";
import fs from "fs";
import formidable from "formidable";
import AWS from "aws-sdk";
import NewFileName from "../utils/lib/randomName";
import { ObjectId } from "mongoose";
import getHashtags from "../utils/lib/hashTags";
import __Person from "../models/person"
import awsUploader from "../utils/lib/awsUploader";
// const S3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.S3_BUCKET_REGION,
// });

const AwsUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if((req as any).user === undefined){
    return  res.status(401).send("login to continue")
    }
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err: any, fields: any, files: any) {
      let path = files.file.filepath;
      let tags: Array<ObjectId> = fields?.tags?.split(",").map((e: any) => e.replace(/[^\w]/g, ""));
      let caption = fields.caption;
      let hashTags = getHashtags(caption);
      let randomName: String = NewFileName() + ".mp4";

      fs.readFile(path,  async function (err, buffer) {
        let params = {
          Bucket: "poshvid",
          Key: `${randomName}`,
          ContentType: "video/mp4",
          Body: buffer,
        };
        let response = await awsUploader.upload(params)
        if(response !== "uploaded"){
         return res.send("error occured while uploading")
        }
        await __Post.create({
                caption,
                tags,
                file: `https://poshvid.s3.amazonaws.com/${randomName}`,
                hashTags,
                user: (req as any)?.user?._id,
              });
              await __Person.findOneAndUpdate({user:(req as any).user._id},{$inc:{posts:1}})
              return res.send("uploaded");
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};
const Stream = async (req: Request, res: Response, next: NextFunction) => {
  let fileKey:any = await (__Post as any).getFileName(req.params.id)
  const bucketParams = {
        Bucket:process.env.S3_BUCKET_NAME as string,
        Key: "lWVkuc8.mp4"
        // Key: fileKey
    }
let stream = await awsUploader.createAWSStream(bucketParams)

  stream.pipe(res);
};

//    let response = await  new PostDataSource().createPost(req.body,(req as any).user)
//    res.send(response)
// res.end()
// }
export { AwsUpload, Stream };
