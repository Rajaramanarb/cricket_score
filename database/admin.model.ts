import { model, models, Schema } from "mongoose";

export interface IAdmin {
  name?: string;
  username?: string;
  email: string;
  password?: string;
  image?: string;
}

export interface IAdminDoc extends IAdmin, Document {
  id: string;
}
const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const Admin = models?.Admin || model<IAdmin>("Admin", AdminSchema);

export default Admin;
