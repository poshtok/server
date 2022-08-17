const AuthQuery = {};
const AuthMutation = {
  signup: async (
    root: any,
    { data }: { data: any },
    { dataSources, req, res }: any
  ) => {
    const { AuthDataSource } = dataSources;
    return await new AuthDataSource().signup(data);
  },
};
const AuthSubscription = {};

export { AuthMutation, AuthQuery, AuthSubscription };
