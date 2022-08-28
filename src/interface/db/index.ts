import { Date, ObjectId } from "mongoose"

export interface user {
    email:string,
    password:string,
    emailVerificationCode:number
    emailVerificationExpires:Date
}
export interface HashtagM{
    post:ObjectId
    hashtag:string
}
export interface PersonM {
    phone:string
    country:string
    fullName:string
    userName:string
    avater:string
    bio:string
    DOB:string
    user:ObjectId
    emailVerified:Boolean
    interests:Array<ObjectId>
    following:Array<String>
    followers:Array<String>
}