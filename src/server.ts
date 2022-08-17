import * as dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express, { Application ,request,Request,response,Response} from "express";
import { ApolloServer, gql } from "apollo-server-express";
import compression from "compression";
import cors from "cors";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import depthLimit from "graphql-depth-limit";
import formatError from "./utils/lib/formatError";
import Database from "./utils/lib/db";
import preSignup from "./services/preLunchSignup";
import contactUs from "./services/contactUs";
import {resolvers,typeDefs} from "./schema"
import dataSources from "./datasources";
(async function () {
  const app:Application = express();
  app.use(compression());
  app.use(cors());
  app.use(express.json({limit:"100mb"}))
  app.use(express.urlencoded({extended:true}))
  app.post("/contactus",contactUs);
  app.post("/prelunchsignup",preSignup)
  app.get("/test",(req:Request,res:Response)=>{
   return res.send("it's working")
  })

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
   context:({req,res})=>({
    res,
    req,
    dataSources,
    engine:{
      reportSchema:true
    }
   }),
    
    validationRules: [depthLimit(7)],
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    formatError,

  });



  await server.start();
  server.applyMiddleware({ app, path: "/",cors : false  });
  Database.connect(process.env.DB_URL as string)
  const PORT = process.env.PORT;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  );
})();
