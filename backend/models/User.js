import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    saved_posts: [
        {
            type: String,
            ref: "post",
            unique: true,
        },
    ],
    //how to link other models
    //discriminator key
});

userSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function () {
    const payload = {
        user : {
            id: this._id,
        }
    }
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, {expiresIn: "24h"});

    return token;
}

const User = mongoose.model("user", userSchema);

export default User;



