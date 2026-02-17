import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    name?: string;
    email: string;
    password?: string;
    image?: string;
    role: "user" | "admin";
    provider: "credentials" | "google" | "github";
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            // Password is not required if using OAuth provider
            required: function (this: IUser) {
                return this.provider === "credentials";
            },
        },
        image: {
            type: String,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        provider: {
            type: String,
            enum: ["credentials", "google", "github"],
            default: "credentials",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent re-compilation of the model if it already exists
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
