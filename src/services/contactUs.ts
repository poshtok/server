import {Request,Response,NextFunction} from "express"
import { extendSchemaImpl } from "graphql/utilities/extendSchema"
const contactUs =(req:Request,res:Response,next:NextFunction)=>{
    // email,title,message
res.send("Mail sent")
}
export default contactUs