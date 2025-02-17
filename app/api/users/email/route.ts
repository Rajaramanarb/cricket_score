import handleError from "@/lib/handlers/error";
import { ValidationError, NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import User from "@/database/user.model";

/**
 * Handles the POST request for retrieving a user by email.
 *
 * @param request - The incoming request object containing the email in JSON format.
 * @returns - A NextResponse object with the user data or an error response.
 *
 * @remarks
 * This function first connects to the MongoDB database using `dbConnect()`.
 * It then extracts the email from the request JSON and logs it to the console.
 * Next, it validates the email using the `UserSchema` and throws a `ValidationError` if the validation fails.
 * It then searches for a user with the given email in the database using `User.findOne()`.
 * If a user is found, it returns a JSON response with a success status and the user data.
 * If no user is found, it throws a `NotFoundError`.
 * If any other error occurs, it calls the `handleError` function to handle the error and returns an error response.
 */
export async function POST(request: Request) {
  await dbConnect();
  const { email } = await request.json();
  try {
    const validatedData = UserSchema.partial().safeParse({ email });
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError("User");
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
