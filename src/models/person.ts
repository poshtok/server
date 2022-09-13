import {Schema,model} from "mongoose"
import { PersonM } from "../interface/db"

const PersonSchema = new Schema<PersonM>({
phone:{
    type:String,
    index:true
},DOB:{
    type:String,
},
country:{
    type:String
},
fullName:{
    type:String
},
userName:{
    type:String,
    // required:true
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
    default:"https://res.cloudinary.com/defbw7rt6/image/upload/v1616062085/shopwitbee-defaultProfileImge.jpg"
},
user:{
    type:Schema.Types.ObjectId
},
followers:[
    {
        type:Schema.Types.ObjectId
    }
],
bio:{
    type:String
},
following:[
    {
        type:Schema.Types.ObjectId
    }
],

})

PersonSchema.statics.getFew = async function(userId){
return await this.findOne({user:userId},{fullName:1,userName:1,avater:1,_id:0})
   
}
export default model<PersonM>("person",PersonSchema)