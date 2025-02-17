import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

/**
 * Handles the GET request for retrieving a user by their ID.
 *
 * @remarks
 * This function is responsible for fetching a user from the database based on the provided ID.
 * If the user is not found, it throws a NotFoundError.
 *
 * @param _ - The original request object.
 * @param params - An object containing the parameters extracted from the request.
 * @param params.params - A promise that resolves to an object containing the `id` parameter.
 *
 * @returns - A NextResponse object containing the JSON response with the user data or an error response.
 *
 * @throws {NotFoundError} - If the user is not found.
 * @throws {APIErrorResponse} - If an error occurs during the database operation.
 */
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("User not found");
  }

  try {
    await dbConnect();
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

/**
 * Handles the DELETE request for deleting a user by their ID.
 *
 * @remarks
 * This function is responsible for deleting a user from the database based on the provided ID.
 * If the user is not found, it throws a NotFoundError.
 *
 * @param _ - The original request object.
 * @param params - An object containing the parameters extracted from the request.
 * @param params.params - A promise that resolves to an object containing the `id` parameter.
 *
 * @returns - A NextResponse object containing the JSON response with a success status and the deleted user data, or an error response.
 * The response status code is set to 204 (No Content) to indicate successful deletion.
 *
 * @throws {NotFoundError} - If the user is not found.
 * @throws {APIErrorResponse} - If an error occurs during the database operation.
 */
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("User not found");
  }

  try {
    await dbConnect();
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return NextResponse.json({ success: true, data: user }, { status: 204 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

/**
 * Handles the PUT request for updating a user by their ID.
 *
 * @remarks
 * This function is responsible for updating a user in the database based on the provided ID and request body.
 * If the user is not found, it throws a NotFoundError.
 *
 * @param request - The original request object containing the user data to be updated.
 * @param params - An object containing the parameters extracted from the request.
 * @param params.params - A promise that resolves to an object containing the `id` parameter.
 *
 * @returns - A NextResponse object containing the JSON response with a success status and the updated user data, or an error response.
 * The response status code is set to 200 (OK) to indicate successful update.
 *
 * @throws {NotFoundError} - If the user is not found.
 * @throws {APIErrorResponse} - If an error occurs during the database operation.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = await params;
  if (!id) {
    throw new NotFoundError("User");
  }
  try {
    await dbConnect();

    const body = await request.json();

    const validatedData = UserSchema.partial().parse(body);

    const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }
    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
