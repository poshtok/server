const AuthQuery = {};
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
    return await new AuthDataSource().updatePerson(data);
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
};
const AuthSubscription = {};

export { AuthMutation, AuthQuery, AuthSubscription };
