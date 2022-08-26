const AuthQuery = {
  friendsToFollow : async ( root: any,  data : { data: string }, { dataSources, req, res }: any) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().friendsToFollow(data);
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

};
const AuthSubscription = {};

export { AuthMutation, AuthQuery, AuthSubscription };
