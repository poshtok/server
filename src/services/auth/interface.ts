import { ObjectId } from "mongoose"

export interface signup {
    email:string,
    password:string
}
export interface loggedInInterface {
    _id:ObjectId
    email:string,
}
export interface Person {
    phone:string
    country:string
    fullName:string
    userName:string
    DOB:Date
    user:ObjectId
    emailVerified:Boolean
    interests:Array<ObjectId>
    following:Array<String>
    followers:Array<String>
}