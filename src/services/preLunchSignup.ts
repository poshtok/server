import {Request,Response,NextFunction} from "express"
import __PreLunchUser from "../models/prelunchUsers"
const preSignup =async(req:Request,res:Response,next:NextFunction)=>{
const {email,fullName} = req.body
console.log("it got here")
if(!email && fullName){
    return res.status(400).send("all fields are required")
}
try {
    await __PreLunchUser.create({email,fullName})
    return res.status(200).send("sucess")
} catch (error) {
    return res.status(500).send("internal server error")

}
}
export default preSignup