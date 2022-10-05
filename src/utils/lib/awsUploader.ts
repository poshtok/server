import AWS from "aws-sdk";
import { S3ReadStream } from "./smartStream";

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});

class Aws {
  async upload(params: AWS.S3.PutObjectRequest): Promise<string> {
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
  async delete(params: AWS.S3.HeadObjectRequest | AWS.S3.DeleteObjectRequest){
    try {
      await S3.headObject(params).promise()
      console.log("File Found in S3")
      try {
          await S3.deleteObject(params).promise()
          return ("deleted")
      }
      catch (err) {
           console.log("ERROR in file Deleting : " + JSON.stringify(err))
           return "ERROR in file Deleting : " + JSON.stringify(err)
      }
  } catch (err:any) {
          console.log("File not Found ERROR : " + err.code)
          return "File not Found ERROR : " + err.code
  }
  
  }
  async  createAWSStream(bucketParams:AWS.S3.PutObjectRequest): Promise<S3ReadStream> {
    return new Promise((resolve, reject) => {
        try {
            S3.headObject(bucketParams, (error, data) => {
                if (error) {
                    throw error
                };

                const stream = new S3ReadStream(bucketParams,S3,data.ContentLength as number,);

                resolve(stream);
            })
        } catch (error) {
            reject(error);
        }
    })
}
}

export default new Aws
