import { Date, ObjectId } from "mongoose"
import  { MongoosasticDocument } from 'mongoosastic'
import  { Document } from 'mongoose'


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
    posts:Number
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
    likedPosts:Array<ObjectId>
    following:Array<String>
    followers:Array<String>
}
export interface PostM extends Document, MongoosasticDocument {
    caption:string
    file:string
    likes:Number
    comments:Number
    views:Number
    tags:Array<ObjectId>
    hashTags:Array<String>
    user:ObjectId
}