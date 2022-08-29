import Base from "../../base";
import __Person from "../../models/person";
import __Hashtag from "../../models/hashtag";
import __User from "../../models/user";
import __Post from "../../models/post";
import { QueryPathEnum } from "./interface";
import { loggedInInterface } from "../auth/interface";
import { PersonM } from "../../interface/db";
class PostDataSource extends Base {
  async query({data:{key,path}}:{data:{ key: string; path: QueryPathEnum }},person:loggedInInterface) {
    switch (path) {
        case QueryPathEnum.TOP:
            let user:PersonM[];
            let hashTags:never[]
            let Videos:[]
               user =  await __Person.find({$or:[{fullName:{ $regex: key, $options: "i" }},{userName:{ $regex: key, $options: "i" }}]},{fullName:1,userName:1,avater:1,_id:1}).limit(2);
              hashTags =  await __Post.find({hastag:{$in:{ $regex: key, $options: "i" }}})

            // await __Post.find({  caption: { $regex: key, $options: "i" }}).sort({"likes":1})
            return{
                user,
                hashTags
            }
        case QueryPathEnum.USER:
          return await __Person.find({$or:[{fullName:{ $regex: key, $options: "i" }},{userName:{ $regex: key, $options: "i" }}]},{fullName:1,userName:1,avater:1,_id:1})
    
        case QueryPathEnum.HASHTAG:
           return  await __Post.find({hastag:{$in:{ $regex: key, $options: "i" }}})
           case QueryPathEnum.VIDEO:
           return  await __Post.find({tags:{$in:{ $regex: key, $options: "i" }}})
            default:
    }
  
  }
}

export default PostDataSource;
