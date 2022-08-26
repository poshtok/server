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
userName:{
    type:String,
    required:true
},
emailVerified:{
    type:Boolean,
    default:false
},
interests:[
    {
        type:Schema.Types.ObjectId
    }
],
avater:{
    type:String,
},
user:{
    type:Schema.Types.ObjectId
},
followers:[
    {
        type:Schema.Types.ObjectId
    }
],
following:[
    {
        type:Schema.Types.ObjectId
    }
],

})

PersonSchema.statics.getFew = async function(userId){
return await this.findOne({user:userId},{fullName:1,userName:1,avater:1})
   
}
export default model<PersonM>("person",PersonSchema)