import Base from "../../base";
import __Person from "../../models/person";
import __Hashtag from "../../models/hashtag";
import __User from "../../models/user";
import __Post from "../../models/post";
import { QueryPathEnum } from "./interface";
import { loggedInInterface } from "../auth/interface";
import { PersonM } from "../../interface/db";
import Paginate from "../../utils/lib/paginate"
class PostDataSource extends Base {
  async query({data:{key,path,page,limit}}:{data:{ key: string; path: QueryPathEnum,page:number,limit:number }},person:loggedInInterface) {
    switch (path) {
        case QueryPathEnum.TOP:
            let user:PersonM[];
            let hashTags:never[]
            let Videos:[]
               user =  await __Person.find({$or:[{fullName:{ $regex: key, $options: "i" }},{userName:{ $regex: key, $options: "i" }}]},{fullName:1,userName:1,avater:1,_id:1}).limit(2);
              hashTags =  await __Post.find({hastag:{$in:{ $regex: key, $options: "i" }}})
              // Videos = await (__Post as any).search({query_string:{query:key}}, { hydrate:true })
            return{
              // Videos,
                user,
                hashTags
            }
        case QueryPathEnum.USER:
          let response:any = await __Person.find({$or:[{fullName:{ $regex: key, $options: "i" }},{userName:{ $regex: key, $options: "i" }}]},{fullName:1,userName:1,avater:1,_id:1})
            return Paginate(response,page,limit)
        case QueryPathEnum.HASHTAG:
           let hashResponse:any = await __Post.find({hastag:{$in:{ $regex: key, $options: "i" }}})
           return Paginate(hashResponse,page,limit)

           case QueryPathEnum.VIDEO:
           let videoResponse:any = await __Post.find({tags:{$in:{ $regex: key, $options: "i" }}})
           return Paginate(videoResponse,page,limit)
 
           default:
    }
  
  }
}

export default PostDataSource;
