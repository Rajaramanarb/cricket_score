import ROUTES from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";

interface Props {
  _id: string;
  name: string;
  products: number;
  showCount?: boolean;
  compact?: boolean; // Additional prop to render in compact mode (optional)
}

const TagCard = ({
  _id,
  name,
  products,
  showCount = false,
  compact = false,
}: Props) => {
  return (
    <Link
      href={ROUTES.PRODUCT_TYPE_ID(_id)}
      className="flex justify-between gap-2"
    >
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <span>{name}</span>
        </div>
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{products}</p>
      )}
    </Link>
  );
};

export default TagCard;
