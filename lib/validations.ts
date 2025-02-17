import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  username: z
    .string()
    .min(3, { message: "Username must be atleast 3 characters long" }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  bio: z.string().optional(),
  image: z.string().url({ message: "Please provide a valid URL" }).optional(),
  location: z.string().optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, { message: "Provider is required." }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
});

export const AdminAccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  name: z.string().min(1, { message: "Name is required." }).optional(),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, { message: "Provider is required." }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"), // Ensures the name is a non-empty string
  isSizeBased: z.boolean(), // Ensures the value is a boolean
  isActive: z.boolean(), // Ensures the value is
  slug: z.string().min(1, "Slug is required"), // Ensures the slug is a non-empty string
});

const sizeDetailsSchema = z.object({
  size: z.string().min(1, "Size is required"), // Ensure non-empty size
  price: z.number().min(0, "Price must be a non-negative number"), // Ensure price is non-negative
  discountedPrice: z
    .number()
    .min(0, "Discounted price must be a non-negative number")
    .optional(), // Optional, non-negative
  quantity: z.number().int().min(0, "Quantity must be a non-negative integer"), // Ensure non-negative integer
});

const variantSchema = z.object({
  color: z.string().min(1, "Color is required"), // Ensure non-empty color
  colorCode: z.string().min(1, "Color code is required"), // Ensure color code is provided
  sizes: z.array(sizeDetailsSchema).min(1, "At least one size is required"), // Ensure array of sizes with at least one entry
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"), // Ensure non-empty name
  description: z.string().optional(), // Optional description
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"), // Slug validation
  productType: z
    .string()
    .regex(objectIdRegex, "Invalid ObjectId format for productType"),
  images: z
    .array(z.string().url())
    .min(1, "At least one image URL is required"), // Array of valid URLs with at least one entry
  variants: z.array(variantSchema).min(1, "At least one variant is required"), // Array of variants with at least one entry
});

export const AdminSignInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required." }).optional(),
    username: z
      .string()
      .min(3, { message: "Username is required." })
      .optional(),
    email: z
      .string()
      .email({ message: "Please provide a valid email address." }),
    image: z
      .string()
      .url({ message: "Please provide a valid URL." })
      .optional(),
  }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});
