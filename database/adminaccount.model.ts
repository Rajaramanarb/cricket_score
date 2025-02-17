import { model, models, Schema, Types } from "mongoose";

export interface IAdminAccount {
  userId: Types.ObjectId;
  name?: string;
  image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
}

export interface IAdminAccountDoc extends IAdminAccount, Document {}

const AdminAccountSchema = new Schema<IAdminAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    name: { type: String },
    image: { type: String },
    password: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const AdminAccount =
  models?.AdminAccount ||
  model<IAdminAccount>("AdminAccount", AdminAccountSchema);

export default AdminAccount;
