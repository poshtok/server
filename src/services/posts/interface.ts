import { ObjectId } from "mongoose"

export enum QueryPathEnum {
    TOP = "TOP",
    USER = "USER",
    HASHTAG = "HASHTAG",
    VIDEO = "VIDEO"
}

export interface createPostType {
    caption:string
    file:any
    tags:Array<ObjectId>
}