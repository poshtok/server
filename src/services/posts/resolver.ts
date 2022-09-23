const PostMutation = {
    createPost: async ( root: any,  data : { data: any }, { dataSources, req, res }: any) => {
        const {PostDataSource} = dataSources
        return await new PostDataSource().createPost(data,req.user)
    },
    likePost: async ( root: any,  data : { data: any }, { dataSources, req, res }: any) => {
        const {PostDataSource} = dataSources
        return await new PostDataSource().likePost(data,req.user)
    }
}
const PostQuery = {
    query: async ( root: any,  data : { data: any }, { dataSources, req, res }: any) => {
        const {PostDataSource} = dataSources
        return await new PostDataSource().query(data,req.user)
    },
    getFollowingPosts: async ( root: any,  data : { data: any }, { dataSources, req, res }: any) => {
        const {PostDataSource} = dataSources
        return await new PostDataSource().getFollowingPosts(data,req.user)
    } ,
    getPostsForYou: async ( root: any,  data : { data: any }, { dataSources, req, res }: any) => {
        const {PostDataSource} = dataSources
        return await new PostDataSource().getPostsForYou(data,req.user)
    } ,
    getUserPosts: async ( root: any,  data : { data: any }, { dataSources, req, res }: any) => {
        const {PostDataSource} = dataSources
        return await new PostDataSource().getUserPosts(data,req.user)
    } ,
     getLikedPosts: async ( root: any,  data : { data: any }, { dataSources, req, res }: any) => {
        const {PostDataSource} = dataSources
        return await new PostDataSource().getLikedPosts(data,req.user)
    } ,
    getFriendsPosts: async ( root: any,  data : { data: any }, { dataSources, req, res }: any) => {
        const {PostDataSource} = dataSources
        return await new PostDataSource().getFriendsPosts(data,req.user)
    }
}
const PostSubscription = {}

export { PostMutation, PostQuery, PostSubscription };
