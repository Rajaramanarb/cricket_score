"use server";

import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from "@/types/global";
import action from "../handlers/action";
import { categorySchema, PaginatedSearchParamsSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose, { FilterQuery } from "mongoose";
import Category, { ICategory } from "@/database/category.model";
import slugify from "slugify";
import Admin from "@/database/admin.model";

interface CreateProductTypeParams {
  name: string;
  isSizeBased: boolean;
  isActive: boolean;
}

export async function createCategory(
  params: CreateProductTypeParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: categorySchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, isSizeBased, isActive } = validationResult?.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  const slugifiedCategoryName = slugify(params.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  let categoryAlreadyExists = await Category.findOne({
    slug: slugifiedCategoryName,
  }).session(session);

  const userId = validationResult?.session?.user?.id;

  try {
    if (categoryAlreadyExists) {
      throw new Error("Category slug already exists"); // Throw an error if the slug already exists in the database. Otherwise, create the category.  // TODO: Update the existing category if the slug already exists.  // You can use the Category.findByIdAndUpdate() method to update the category.  // Be sure to set the 'new' option to true to return the updated document instead of the original document.  // Also, consider using a unique index on the slug field to ensure that the slug is unique across all categories.  // You can use the Mongoose schema options like unique: true to achieve this.  // Example: categorySchema.index({ slug: 1 }, { unique: true });  // Make sure to update the existing category instead of creating a new one if the slug already exists.  // Also, consider using a unique index on the slug field to ensure that the slug is unique across all categories.  // You can use the Mongoose schema
    }
    const [category] = await Category.create(
      [
        {
          name,
          isSizeBased,
          isActive,
          slug: slugifiedCategoryName,
          createdBy: userId,
        },
      ],
      { session }
    );

    if (!category) {
      throw new Error("Failed to create category");
    }

    await session.commitTransaction();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(category)),
      status: 201,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function getCategories(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ categories: ICategory[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Category> = {};
  if (filter === "recommended") {
    return {
      success: true,
      data: { categories: [], isNext: false },
      status: 200,
    };
  }

  if (query) {
    filterQuery.$or = [
      {
        name: { $regex: new RegExp(query, "i") },
      },
      {
        slug: { $regex: new RegExp(query, "i") },
      },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    default:
      sortCriteria = { createdAt: 1 };
      break;
  }

  try {
    const totalCategories = await Category.countDocuments(filterQuery);
    const categories = await Category.find(filterQuery)
      .populate({
        path: "createdBy",
        select: "name image",
        model: Admin,
      })
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);
    const isNext = totalCategories > skip + categories.length;
    return {
      success: true,
      data: { categories: JSON.parse(JSON.stringify(categories)), isNext },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
