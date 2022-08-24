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
    DOB:Date
    user:ObjectId
    emailVerified:Boolean
}