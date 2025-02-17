import AdminAccount from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AdminAccountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

/**
 * Handles GET requests to retrieve a single account by its ID.
 *
 * @param _ - The original request object.
 * @param params - An object containing the request parameters.
 * @param params.params - A promise that resolves to an object containing the `id` parameter.
 *
 * @returns - A `NextResponse` object with the account data or an error response.
 *
 * @throws - Throws a `NotFoundError` if the account is not found.
 * @throws - Throws an error if there is a database connection issue or a validation error.
 */
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("AdminAccount");
  }

  try {
    await dbConnect();
    const account = await AdminAccount.findById(id);
    if (!account) {
      throw new NotFoundError("AdminAccount");
    }

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

/**
 * Handles DELETE requests to delete a single account by its ID.
 *
 * @param _ - The original request object.
 * @param params - An object containing the request parameters.
 * @param params.params - A promise that resolves to an object containing the `id` parameter.
 *
 * @returns - A `NextResponse` object with a success status and the deleted account data, or an error response.
 *
 * @throws - Throws a `NotFoundError` if the account is not found.
 * @throws - Throws an error if there is a database connection issue.
 */
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("AdminAccount");
  }

  try {
    await dbConnect();
    const account = await AdminAccount.findByIdAndDelete(id);
    if (!account) {
      throw new NotFoundError("AdminAccount");
    }
    return NextResponse.json({ success: true, data: account }, { status: 204 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

/**
 * Handles PUT requests to update a single account by its ID.
 *
 * @param request - The original request object containing the updated account data.
 * @param params - An object containing the request parameters.
 * @param params.params - A promise that resolves to an object containing the `id` parameter.
 *
 * @returns - A `NextResponse` object with a success status and the updated account data, or an error response.
 *
 * @throws - Throws a `NotFoundError` if the account is not found.
 * @throws - Throws a `ValidationError` if the request body does not match the expected schema.
 * @throws - Throws an error if there is a database connection issue.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = await params;
  if (!id) {
    throw new NotFoundError("AdminAccount");
  }
  try {
    await dbConnect();

    const body = await request.json();

    const validatedData = AdminAccountSchema.partial().safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const updatedAccount = await AdminAccount.findByIdAndUpdate(
      id,
      validatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAccount) {
      throw new NotFoundError("AdminAccount");
    }
    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
