const PostMutation = {}
const PostQuery = {
    query: async ( root: any,  data : { data: any }, { dataSources, req, res }: any) => {
        const {PostDataSource} = dataSources
        return await new PostDataSource().query(data)
    }
}
const PostSubscription = {}

export { PostMutation, PostQuery, PostSubscription };
