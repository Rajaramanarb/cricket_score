import { model, models, Schema } from "mongoose";

export interface IRole {
  name: string;
  permissions: {
    products: {
      add: Boolean;
      edit: Boolean;
      delete: Boolean;
    };
    orders: {
      view: Boolean;
      process: Boolean;
    };
    users: {
      view: Boolean;
    };
    vouchers: {
      add: Boolean;
      edit: Boolean;
    };
  };
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    permissions: {
      products: {
        add: { type: Boolean, default: true },
        edit: { type: Boolean, default: true },
        delete: { type: Boolean, default: false },
      },
      orders: {
        view: { type: Boolean, default: false },
        process: { type: Boolean, default: false },
      },
      users: {
        view: { type: Boolean, default: false },
      },
      vouchers: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Role = models?.role || model<IRole>("Role", RoleSchema);

export default Role;
