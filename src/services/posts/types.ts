import { gql } from "apollo-server-express";

export const PostTypes = gql`
extend type Mutation {
    # createPost(data:createPostInput):createpostResponse!
    createPost(data:createPostInput):String
    likePost(_id:ID):likePostResponse!
    unLikePost(_id:ID):unLikePostResponse!
}
 extend type Query {
    query(data:queryFiledsInput):JSON  
    getFollowingPosts:[PostResponse]
    getPostsForYou:[PostResponse]
 }

input createPostInput {
    caption:String
    file:String
    tags:[ID]
}
input fileType {
        body:String
        fileName:String
        fileSize:Int
        fileType:String
    }

type PostResponse {
    caption:String
    file:String!
    hashTags:[String]
    tags:[Tags]
    _id:ID!
    likes:Int!
    views:Int!
    comments:Int!
    user:fewUserResponse
    }
    type Tags{
        _id:ID!
        userName:String!
    }
    type likePostResponse {
        likes:Int!
    } 
    type unLikePostResponse {
        likes:Int!
    }
    input queryFiledsInput {
        key:String!
        path:QueryPath!
        page:Int!
        limit:Int!
    }
  

 enum QueryPath {
    TOP
    USER
    HASHTAG
}

`;
