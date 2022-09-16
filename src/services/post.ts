import { Request, Response, NextFunction } from "express";
import PostDataSource from "./posts/datasource";
import fs from "fs";
import formidable from "formidable";
import { parseType } from "graphql";
import AWS from "aws-sdk";
import NewFileName from "../utils/lib/randomName";
const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});
const AwsUpload = async (req: Request, res: Response, next: NextFunction) => {
 try {
  

  const form = new formidable.IncomingForm();

  form.parse(req, async function (err: any, fields: any, files: any) {
    var path = files.file.filepath;
    // console.log(fields,"inputs")
    // let ok = Array.from(fields?.tags)
    // console.log(ok,"ppp")
    let randomName:String = NewFileName() + ".mp4"
    console.log(randomName,"name")
    fs.readFile(path, function (err, buffer) {
      let params = {
        Bucket: "poshvid",
        Key:`${randomName}`,
        ContentType: "video/mp4",
        Body: buffer,
      };
      S3.putObject(params, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
          console.log(`https://poshvid.s3.amazonaws.com/${randomName}`)

          return res.send("upload");
        }
      });
    });
  });
} catch (error) {
  console.log(error)
  return res.status(500).send("internal server error")
}
};
const Stream = async (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range;
  const videoPath = req.params?.path;
  const videoSize = fs.statSync(videoPath).size;
console.log(videoPath,videoSize,"query")
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
