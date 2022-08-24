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
    fullName:string
    phone:string
    country:string
    occupation:string
}