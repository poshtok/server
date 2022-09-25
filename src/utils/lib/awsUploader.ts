import AWS from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";
const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});

class Aws {
  async upload(params: PutObjectRequest): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        S3.putObject(params, async function (err, info) {
          if (err) {
            return resolve(err.message);
          } else {
            return resolve("uploaded");
          }
        });
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }
}

export default new Aws
