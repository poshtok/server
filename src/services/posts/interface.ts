import { ObjectId } from "mongoose"

export enum QueryPathEnum {
    TOP = "TOP",
    USER = "USER",
    HASHTAG = "HASHTAG",
    VIDEO = "VIDEO"
}

export interface createPostType {
    caption:string
    file:{
        body:string
        fileName:string
        fileSize:Number
        fileType:string
    }
    hashTags:Array<string>
    tags:Array<ObjectId>
}