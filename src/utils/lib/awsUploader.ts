import AWS from "aws-sdk";
import stream from "stream";
type S3UploadStream = {
  writeStream: stream.PassThrough;
  promise: Promise<AWS.S3.ManagedUpload.SendData>;
};

type S3UploadConfig = {
    accessKeyId: string | undefined;
    secretAccessKey: string | undefined;
    destinationBucketName: string | undefined;
    region: string | undefined;
  };
  export type File = {
    filename: string;
    mimetype: string;
    encoding: string;
    stream?: any;
  }
  
  export class AWSS3Uploader {
    private s3: AWS.S3;
    public config: S3UploadConfig;
  
    constructor(config: S3UploadConfig) {
      AWS.config = new AWS.Config();
      AWS.config.update({
        region: config.region ,
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      });
  
      this.s3 = new AWS.S3();
      this.config = config;
    }
   
    

    async Upload(file:Promise<File>){
        const { stream, filename, mimetype, encoding } = await file;

    }
  }