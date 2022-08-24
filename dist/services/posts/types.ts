import { gql } from "apollo-server-express";

const PostTypes = gql`
extends type Mutation {
    createpost(data:createPostInput):UcreatepostResponse
}
#  extends type Query {
#  }

input createPostInput {
    caption:string
    file:string
}

type createpostResponse {
      filename: String!
      mimetype: String!
      encoding: String!
      url: String!
    }

`

export default PostTypes