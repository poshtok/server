import {Request,Response,NextFunction} from "express"
import PostDataSource from "./posts/datasource"
const AwsUpload =async(req:Request,res:Response,next:NextFunction)=>{
    console.log(req.body,req)
//    let response = await  new PostDataSource().createPost(req.body,(req as any).user)
//    res.send(response)
}
export default AwsUpload