import { useState } from "react";
import Card from "@/components/card";
import CardMenu from "@/components/card/CardMenu";

const TemplateCard = (props: {
  id: number;
  image: string;
  title: string;
  size: string;
  templateId: number;
  extra?: string;
  onClick: (id: number) => void;
  onDeleteTemplate: (id: number) => void;
}) => {
  const {
    id,
    templateId,
    title,
    size,
    image,
    extra,
    onClick,
    onDeleteTemplate,
  } = props;
  return (
    <Card
      extra={`flex flex-col w-full h-full !p-4 3xl:p-![18px] bg-white ${extra}`}
    >
      <div className="h-full w-full">
        <div
          className="relative w-full hover:cursor-pointer"
          onClick={() => onClick(templateId)}
        >
          <img
            src={image}
            className="mb-3 h-full w-full rounded-md 3xl:h-full 3xl:w-full"
            alt=""
          />
        </div>

        <div className="flex items-center justify-between px-1 flex-col lg:justify-between 3xl:justify-between">
          <p className="text-lg text-center font-bold text-navy-700">{title}</p>
          <p className="mt-1 text-center text-sm font-medium text-gray-600 md:mt-2">
            {size}
          </p>
          {!!onDeleteTemplate && (
            <button
              className="bg-red-600 text-white px-4 hover:bg-red-800 mt-4"
              onClick={() => onDeleteTemplate(id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TemplateCard;
