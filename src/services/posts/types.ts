import { gql } from "apollo-server-express";

export const PostTypes = gql`
extend type Mutation {
    createpost(data:createPostInput):createpostResponse
}
 extend type Query {
    query(data:queryFiledsInput):JSON
 }

input createPostInput {
    caption:String
    file:String
}

type createpostResponse {
      filename: String!
      mimetype: String!
      encoding: String!
      url: String!
    }
    input queryFiledsInput {
        key:String
        path:QueryPath
        page:Int
        limit:Int
    }

 enum QueryPath {
    TOP
    USER
    HASHTAG
}

`;
