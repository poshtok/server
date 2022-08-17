import {ObjectId} from "mongoose"
import jwt from "jsonwebtoken";
const generateToken = async({_id,email}:{_id:ObjectId,email:string})=>{
    return  jwt.sign({ email, _id }, process.env.SECRETKEY as string);
}
export default generateToken