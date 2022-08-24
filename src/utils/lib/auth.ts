import * as jwt from "jsonwebtoken";
import {Request,Response,NextFunction} from "express"

export default async (req:Request, res:Response, next:NextFunction) => {
  try {
    let tokens = null; 
    if (req && req.headers["token"]) {
      tokens = req.headers["token"];
      (req as any).user =  jwt.verify((tokens as string), (process.env.SECRETKEY as string));
    }
    return tokens;
  } catch (e:any) {
    if (e.message.includes("expired")) {
      (req as any).user = null;
    }
  } finally {
    next();
  }
};