import mongoose from "mongoose";

const VaultSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    password : {type : String , required : true},
    url : {type : String},
    notes : {type : String},
    tags : {type : [String]}
} , {timestamps : true})

const Vault = mongoose.models.Vault || mongoose.model("Vault" , VaultSchema);

export default Vault;
