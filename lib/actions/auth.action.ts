"use server";
import Admin from "@/database/admin.model";
import AdminAccount from "@/database/adminaccount.model";
import { ActionResponse, ErrorResponse } from "@/types/global";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { SignInSchema, SignUpSchema } from "../validations";
import { signIn } from "@/auth";
import { NotFoundError } from "../http-errors";

export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { name, username, email, password } = validationResult?.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingAdmin = await Admin.findOne({ email }).session(session);
    if (existingAdmin) {
      throw new Error("Admin already exists");
    }
    const existingUsername = await Admin.findOne({ username }).session(session);
    if (existingUsername) {
      throw new Error("Username already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const [newUser] = await Admin.create(
      [
        {
          username,
          name,
          email,
        },
      ],
      { session }
    );

    await AdminAccount.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );
    await session.commitTransaction();

    await signIn("credentials", { email, password, redirect: false });
    return { success: true, status: 200 };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignInSchema });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { email, password } = validationResult?.params!;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      throw new NotFoundError("Admin");
    }

    const existingAdminAccount = await AdminAccount.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    if (!existingAdminAccount) {
      throw new NotFoundError("Account");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingAdminAccount.password
    );
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }
    await signIn("credentials", { email, password, redirect: false });
    return { success: true, status: 200 };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
