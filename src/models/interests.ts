import {Schema,model} from "mongoose"

const interestSchema = new Schema({
    name:{
        type:String,
        unique:true,
        index:true,
        required:true
    }
})
export default model("interest",interestSchema)