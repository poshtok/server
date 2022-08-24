import {AuthMutation,AuthQuery,AuthSubscription} from "./services/auth/resolver"
const Mutation = {
...AuthMutation
}
const Query = {
  ...AuthQuery
}
const Subscription = {
  ...AuthSubscription
}
export {
    Mutation,
    Query,
    Subscription,
  };