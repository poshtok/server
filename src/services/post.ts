import { Request, Response, NextFunction } from "express";
import __Post from "../models/post";
import fs from "fs";
import formidable from "formidable";
import AWS from "aws-sdk";
import NewFileName from "../utils/lib/randomName";
import { ObjectId } from "mongoose";
import getHashtags from "../utils/lib/hashTags";
import Base from "../base"
const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});
const AwsUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if((req as any).user === undefined){
    return  res.status(401).send("login to continue")
    }
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err: any, fields: any, files: any) {
      let path = files.file.filepath;
      let tags: Array<ObjectId> = fields?.tags
        .split(",")
        .map((e: any) => e.replace(/[^\w]/g, ""));
      let caption = fields.caption;
      let hashTags = getHashtags(caption);
      let randomName: String = NewFileName() + ".mp4";

      fs.readFile(path,  function (err, buffer) {
        let params = {
          Bucket: "poshvid",
          Key: `${randomName}`,
          ContentType: "video/mp4",
          Body: buffer,
        };
       res.end()
        S3.putObject(params,async function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("uploaded")
            await __Post.create({
              caption,
              tags,
              file: `https://poshvid.s3.amazonaws.com/${randomName}`,
              hashTags,
              user: (req as any)?.user?._id,
            });
            return res.send("uploaded");
          }
        });
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};
const Stream = async (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range;
  const videoPath = req.params?.path;
  const videoSize = fs.statSync(videoPath).size;
  console.log(videoPath, videoSize, "query");
  const chunkSize = 1 * 1e6;
  const start = Number((range as string).replace(/\D/g, ""));
  const end = Math.min(start + chunkSize, videoSize - 1);

  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);

  const stream = fs.createReadStream(videoPath, { start, end });
  stream.pipe(res);
};

//    let response = await  new PostDataSource().createPost(req.body,(req as any).user)
//    res.send(response)
// res.end()
// }
export { AwsUpload, Stream };
