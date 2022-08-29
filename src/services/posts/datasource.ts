import Base from "../../base";
import __Person from "../../models/person";
import __Hashtag from "../../models/hashtag";
import __User from "../../models/user";
import { QueryPathEnum } from "./interface";
class PostDataSource extends Base {
  async query({data:{key,path}}:{data:{ key: string; path: QueryPathEnum }}) {
    switch (path) {
        case QueryPathEnum.TOP:
            
         break;
        case QueryPathEnum.USER:
    
        break;
        
        case QueryPathEnum.HASHTAG:
            break;
        
            default:
    }
  
  }
}

export default PostDataSource;
