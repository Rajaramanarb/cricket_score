import { model, models, Schema } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  image?: string;
  bio?: string;
  location?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    bio: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

const User = models?.user || model<IUser>("User", UserSchema);

export default User;
