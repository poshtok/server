import {Schema,model} from "mongoose"
import { PersonM } from "../interface/db"

const PersonSchema = new Schema<PersonM>({
phone:{
    type:String,
    index:true
},
country:{
    type:String
},
fullName:{
    type:String
},
emailVerified:{
    type:Boolean,
    default:false
},
user:{
    type:Schema.Types.ObjectId
}

})
export default model<PersonM>("person",PersonSchema)