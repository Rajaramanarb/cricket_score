import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagCard from "../cards/TagCard";

const hotProducts = [
  {
    _id: "1",
    productName: "Marvel Oversized Tee",
  },
  {
    _id: "2",
    productName: "Nike Air Zoom Pegasus 36",
  },
  {
    _id: "3",
    productName: "Adidas Ultraboost 20",
  },
  { _id: "4", productName: "Black Panther tee" },
  { _id: "5", productName: "Doctor Strange Edition" },
];

const PopularProductTypes = [
  { _id: "1", productType: "Oversized Tees", products: 100 },
  { _id: "2", productType: "Joggers", products: 200 },
  { _id: "3", productType: "Tees for men", products: 250 },
];

const RightSidebar = () => {
  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[320px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light800">Top Products</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotProducts.map(({ _id, productName }) => (
            <Link
              key={_id}
              href={ROUTES.PRODUCT(_id)}
              className="cursor-pointer flex items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700 ">
                {productName}
              </p>
              <Image
                src="/icons/chevron-right.svg"
                alt="Right"
                width={20}
                height={20}
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Product Types</h3>
        <div className="mt-7 flex flex-col gap-4">
          {PopularProductTypes.map(({ _id, productType, products }) => (
            <TagCard
              key={_id}
              _id={_id}
              name={productType}
              products={products}
              showCount
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
