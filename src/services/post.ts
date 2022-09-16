import {Request,Response,NextFunction} from "express"
import PostDataSource from "./posts/datasource"
import fs from "fs"
import formidable from "formidable"
import { parseType } from "graphql"
import AWS from "aws-sdk"
const S3= new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.S3_BUCKET_REGION,
      })
const AwsUpload =async(req:Request,res:Response,next:NextFunction)=>{
    const form  = new formidable.IncomingForm();

    form.parse(req,async function(err:any,fields:any,files:any){

console.log(fields,"fields")
      // var path = files.file.filepath;
var path = fields.file;    
    fs.readFile(path, function (err, buffer) {

console.log(buffer,"buffer file")       
 let params = {
                Bucket: "poshvid",
               // Key:`${files.file.originalFilename}`,
                 Key:( "eme1.mp4"),
                ContentType:"video/mp4",
                Body: buffer,
             
              };
        
          S3.putObject(params,function(err,info){
          if(err){
            console.log(err)
          }else{
            console.log(info)
            return res.send("upload")
          }
        });

      })
    })
  
  

    };


    

//    let response = await  new PostDataSource().createPost(req.body,(req as any).user)
//    res.send(response)
// res.end()
// }
export default AwsUpload
