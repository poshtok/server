const AuthQuery = {
  friendsToFollow : async ( root: any,  data : { data: string }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().friendsToFollow(data);
  },
  isFollowing : async ( root: any,  data : { data: string }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().isFollowing(data,req.user);
  }, 
  getFollowers : async ( root: any,  data : { data: string }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().getFollowers(req.user);
  },
  getFollowing : async ( root: any,  data : { data: string }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().getFollowing(req.user);
  }, 
  getUserFollowing : async ( root: any,  data : { data: string }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().getUserFollowing(data,req.user);
  }, 
  getUserFollowers : async ( root: any,  data : { data: string }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().getUserFollowers(data,req.user);
  },
  getCurrentUser : async ( root: any,  data : { data: string }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().getCurrentUser(req.user);
  },
  getUser : async ( root: any,  data : { data: string }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().getUser(data,req.user);
  },
};
const AuthMutation = {
  signup: async ( root: any, { data }: { data: any }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().signup(data);
  }, 
  loginUser: async ( root: any, { data }: { data: any }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().loginUser(data);
  }, 
  updatePerson: async ( root: any, { data }: { data: any }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().updatePerson(data,req.user);
  },
  updateAvater: async ( root: any, { data }: { data: any }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().updateAvater(data,req.user);
  }, 
  forgotPassword: async ( root: any, { data }: { data: any }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().forgotPassword(data);
  },
  resetPassword: async ( root: any, { data }: { data: any }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().resetPassword(data);
  },
  verifyEmail : async ( root: any, { data }: { data: any }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().verifyEmail(data,req.user);
  },
  resendVerificationCode : async ( root: any,  data : { data: string }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().resendVerificationCode(data);
  },
  follow : async ( root: any,  data : { data: string }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().follow(data,req.user);
  },
   unFollow : async ( root: any,  data : { data: string }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().unFollow(data,req.user);
  },

};
const AuthSubscription = {};

export { AuthMutation, AuthQuery, AuthSubscription };
