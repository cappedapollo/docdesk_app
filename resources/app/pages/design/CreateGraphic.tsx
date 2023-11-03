import { useState, useEffect, useCallback } from "react";
import TemplateCard from "@/components/card/TemplateCard";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { LoadTemplateListAction } from "@/store/actions/templates";
import { setCurDesignId, setCurDesignName } from "@/store/reducers/design";
import Banner from "./Banner";

const CreateGraphic = () => {
  const bLoading = useAppSelector((state) => state.shared.bLoading);
  const navigate = useNavigate();
  const [searchValue, SetSearchValue] = useState("");
  const templateList = useAppSelector((state) => state.templates.templateList);
  const dispatch = useAppDispatch();
  console.log("Effect");
  useEffect(() => {
    dispatch(LoadTemplateListAction());
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    SetSearchValue(e.target.value);
  };

  const onTapTemplate = useCallback(
    (id: number) => {
      console.log(id);
      const pageData = JSON.parse(templateList[id].data);
      dispatch(setCurDesignId(-1));
      dispatch(setCurDesignName(templateList[id].name));
      navigate("/user/editor", {
        state: {
          curDesignId: -1,
          curDesignName: templateList[id].name,
          pageData: [pageData],
        },
      });
    },
    [templateList]
  );

  return (
    <div className="w-full h-full px-2">
      <Banner
        title="Create a graphic"
        description="Select a preset size or enter a custom graphic dimension to get started"
      />
      <div className="flex h-[40px] mb-4 mt-4 md:w-2/5 sm:w-full items-center rounded-full bg-lightPrimary text-navy-70">
        <p className="pl-3 pr-2 text-xl">
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-gray-400 dark:text-white"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </p>
        <input
          type="text"
          placeholder="Search..."
          className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <div className="h-full w-full">
        {/* Main Content */}
        <main className={`mx-[12px] h-full flex-none transition-all md:pr-2`}>
          <div className="h-full">
            <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
              {templateList
                .filter((template) => {
                  if (searchValue == "") return true;
                  return template.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
                    ? true
                    : false;
                })
                .map((template, index) => {
                  return (
                    <TemplateCard
                      key={index}
                      templateId={index}
                      image={template.img}
                      title={template.name}
                      size={template.layer_size}
                      onClick={onTapTemplate}
                    />
                  );
                })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateGraphic;
