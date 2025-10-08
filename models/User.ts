import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    twoFactorSecret: { type: String },
    is2FAEnabled: { type: Boolean, default: false },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;