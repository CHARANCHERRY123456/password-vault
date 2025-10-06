import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function signToken(user :{id : string, email : string}){
    if(!user){
        throw new Error("User not found");
    }
    return jwt.sign({user}, JWT_SECRET, {expiresIn : "1h"});
}

export async function  hashPassword(password : string) {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password : string, hashedPassword : string) {
    return bcrypt.compare(password, hashedPassword);
}

export async function generateTwoFactorSecret(email : string) {
    return speakeasy.generateSecret({name : `MyApp${email}`});
}

export async function verifyTwoFactorToken(secret : string, token : string) {
    return speakeasy.totp.verify({
        secret : secret,
        token : token,
        encoding : "base32",
    });
}