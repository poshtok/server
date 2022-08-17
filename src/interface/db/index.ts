import { Date, ObjectId } from "mongoose"

export interface user {
    email:string,
    password:string
}
export interface PersonM {
    phone:string
    country:string
    fullName:string
    userName:string
    DOB:Date
    user:ObjectId
}