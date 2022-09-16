import { Request, Response, NextFunction } from "express";
import PostDataSource from "./posts/datasource";
import fs from "fs";
import formidable from "formidable";
import { parseType } from "graphql";
import AWS from "aws-sdk";
const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});
const AwsUpload = async (req: Request, res: Response, next: NextFunction) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async function (err: any, fields: any, files: any) {
    // console.log(fields, "fields");
    var path = files.file.filepath;
    // var path = fields.file;
    fs.readFile(path, function (err, buffer) {
      let params = {
        Bucket: "poshvid",
        Key:`${files.file.originalFilename}`,
        // Key: "eme1.mp4",
        ContentType: "video/mp4",
        Body: buffer,
      };

      S3.putObject(params, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
          return res.send("upload");
        }
      });
    });
  });
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
