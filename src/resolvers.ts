import {AuthMutation,AuthQuery,AuthSubscription} from "./services/auth/resolver"
import {PostMutation,PostQuery,PostSubscription} from "./services/posts/resolver"
const Mutation = {
...AuthMutation,
...PostMutation
}
const Query = {
  ...AuthQuery,
  ...PostQuery
}
const Subscription = {
  ...AuthSubscription,
  ...PostSubscription
}
export {
    Mutation,
    Query,
    Subscription,
  };