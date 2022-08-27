import { Date, ObjectId } from "mongoose"

export interface user {
    email:string,
    password:string,
    emailVerificationCode:number
    emailVerificationExpires:Date
}
export interface PersonM {
    phone:string
    country:string
    fullName:string
    userName:string
    avater:string
    DOB:string
    user:ObjectId
    emailVerified:Boolean
    interests:Array<ObjectId>
    following:Array<String>
    followers:Array<String>
}