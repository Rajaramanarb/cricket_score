import { model, models, Schema, Types } from "mongoose";

export interface IAddress {
  userId: Types.ObjectId;
  name: string;
  address1: string;
  address2?: string;
  address3?: string;
  pincode: string;
  state: string;
  deliveryinstruction?: string;
  contact: string;
}

const AddressSchema = new Schema<IAddress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String },
    address3: { type: String },
    pincode: { type: String, required: true },
    state: { type: String, required: true },
    deliveryinstruction: { type: String },
    contact: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Address = models?.Address || model<IAddress>("Address", AddressSchema);

export default Address;
