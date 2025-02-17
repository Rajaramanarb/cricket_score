import Admin from "@/database/admin.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

/**
 * Retrieves a list of users from the database.
 *
 * @returns {Promise<NextResponse>} A NextResponse object containing the list of users or an error message.
 *
 * @throws Will throw an error if there is a problem connecting to the database or retrieving the users.
 *
 * @example
 * ```typescript
 * const response = await GET();
 * if (response.status === 200) {
 *   console.log(response.json().data); // Output: Array of user objects
 * } else {
 *   console.error(response.json().error); // Output: Error message
 * }
 * ```
 */
export async function GET() {
  try {
    await dbConnect();
    const users = await Admin.find();
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

/**
 * Handles POST requests to create a new user in the database.
 *
 * @param {Request} request - The incoming request object containing the user data.
 *
 * @returns {Promise<NextResponse>} A NextResponse object containing the success status and the created user data,
 * or an error message if an error occurs during the process.
 *
 * @throws Will throw an error if there is a problem connecting to the database,
 * validating the user data, or creating the user.
 *
 * @example
 * ```typescript
 * const request = new Request('https://example.com/api/users', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email: 'user@example.com', username: 'exampleUser', password: 'password123' })
 * });
 *
 * const response = await POST(request);
 * if (response.status === 201) {
 *   console.log(response.json().data); // Output: The created user object
 * } else {
 *   console.error(response.json().error); // Output: Error message
 * }
 * ```
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserSchema.safeParse(body);
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username } = validatedData.data;

    const existingUser = await Admin.findOne({ email });

    if (existingUser) {
      throw new Error("Admin already exists");
    }

    const existingUserName = await Admin.findOne({ username });
    if (existingUserName) {
      throw new Error("Username already exists");
    }

    const newAdmin = await Admin.create(validatedData.data);
    return NextResponse.json(
      { success: true, data: newAdmin },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
