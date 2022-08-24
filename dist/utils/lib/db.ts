import mongoose, { ConnectOptions } from "mongoose";
import { MongoClient } from 'mongodb';

class Db {
constructor(){
}
async connect(db_url:string){
  try {
    // connect to the database
    await mongoose.connect(db_url, { useNewUrlParser: true,autoIndex: true,} as ConnectOptions);
  console.log(`Database Connected`)
} catch (error) {
    //catch error which might occur
    console.log("Database Connection Error",(error as any).message)
  }
 
}
}
export default new Db