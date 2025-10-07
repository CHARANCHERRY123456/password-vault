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

// Add indexes for better query performance
VaultSchema.index({ userId: 1, updatedAt: -1 }); // For sorted list by user
VaultSchema.index({ userId: 1, title: 'text' }); // For text search
VaultSchema.index({ userId: 1, tags: 1 }); // For filtering by tags

const Vault = mongoose.models.Vault || mongoose.model("Vault" , VaultSchema);

export default Vault;
