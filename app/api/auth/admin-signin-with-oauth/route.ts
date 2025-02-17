import Admin from "@/database/admin.model";
import AdminAccount from "@/database/adminaccount.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AdminSignInWithOAuthSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = AdminSignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { name, username, email, image } = user;
    const slugifiedUserName = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });
    let existingAdmin = await Admin.findOne({ email }).session(session);
    if (!existingAdmin) {
      [existingAdmin] = await Admin.create(
        [
          {
            name,
            username: slugifiedUserName.replace(" ", "").toLowerCase(),
            email,
            image,
          },
        ],
        { session }
      );
    } else {
      const updatedData: { name?: string; image?: string } = {};
      if (existingAdmin.name !== name) {
        updatedData.name = name;
      }
      if (existingAdmin.image !== image) {
        updatedData.image = image;
      }
      if (Object.keys(updatedData).length > 0) {
        await Admin.updateOne(
          { _id: existingAdmin._id },
          { $set: updatedData }
        ).session(session);
      }
    }
    const existingAdminAccount = await AdminAccount.findOne({
      userId: existingAdmin._id,
      provider,
      providerAccountId,
    }).session(session);
    if (!existingAdminAccount) {
      await AdminAccount.create(
        [
          {
            userId: existingAdmin._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }
    await session.commitTransaction();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}
