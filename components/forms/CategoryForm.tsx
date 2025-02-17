"use client";
import { categorySchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { createCategory } from "@/lib/actions/category.action";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";

const CategoryForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      isSizeBased: true,
      isActive: true,
      slug: "",
    },
  });

  const handleCreateCategory = async (data: z.infer<typeof categorySchema>) => {
    const result = await createCategory(data);
    if (result.success) {
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      router.push(ROUTES.PRODUCT_TYPE);
    } else {
      toast({
        title: `Error ${result.status}`,
        description: result?.error?.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateCategory)}
      >
        <FormField
          control={form.control}
          name={"name"}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Category Name {}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  required
                  type={"text"}
                  {...field}
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Provide a valid category name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"isSizeBased"}
          render={({ field }) => (
            <FormItem className="flex w-full flex-row justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Size Based {}
                  <span className="text-primary-500">*</span>
                </FormLabel>
                <FormDescription className="body-regular text-light-500 mt-2.5">
                  Product associated with this product will be size oriented?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"isActive"}
          render={({ field }) => (
            <FormItem className="flex w-full flex-row justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Publish Category Live {}
                  <span className="text-primary-500">*</span>
                </FormLabel>
                <FormDescription className="body-regular text-light-500 mt-2.5">
                  Should the product category be listed in the site?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient !text-light-900 w-fit"
          >
            Create Category
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
