import {Request,Response,NextFunction} from "express"
const contactUs =(req:Request,res:Response,next:NextFunction)=>{
res.send("Mail sent")
}
export default contactUs