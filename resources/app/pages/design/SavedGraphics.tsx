import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DesignCard from "@/components/card/DesignCard";
import ModalDialog from "@/components/modal";
import Banner from "./Banner";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  LoadDesignAction,
  DeleteDesignAction,
  RenameDesignAction,
  DuplicateDesignAction,
} from "@/store/actions/design";
import { setCurDesignId, setCurDesignName } from "@/store/reducers/design";
import InputField from "@/components/fields/InputField";
import {
  IFieldObject,
  useReactForm,
} from "@surinderlohat/react-form-validation";

const field: IFieldObject = {
  designName: {
    label: "Design Name",
    placeholder: "Enter your design name.",
    rules: [{ rule: "required", message: "This field is required" }],
  },
};

const SavedGraphics = () => {
  const [bOpen, setOpen] = useState(true);
  const category = ["Sample1", "Sample2", "Sample3"];
  const [searchValue, SetSearchValue] = useState("");
  const [selDesignId, setSelDesignId] = useState(-1);
  const [openChangeName, setOpenChangeName] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const designList = useAppSelector((state) => state.designs.designList);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const changeForm = useReactForm(field);

  useEffect(() => {
    dispatch(LoadDesignAction());
  }, []);

  const onTapDesign = useCallback(
    (id: number) => {
      const pageData = JSON.parse(designList[id].data);
      dispatch(setCurDesignId(designList[id].id));
      dispatch(setCurDesignName(designList[id].name));
      navigate("/user/editor", {
        state: {
          curDesignId: designList[id].id,
          curDesignName: designList[id].name,
          pageData: pageData,
        },
      });
    },
    [designList]
  );

  const handleDelete = useCallback(
    (id: number) => {
      setSelDesignId(designList[id].id);
      setOpenDeleteConfirm(true);
    },
    [designList]
  );

  const handleConfirmDelete = () => {
    setOpenDeleteConfirm(false);
    dispatch(DeleteDesignAction(selDesignId));
  };

  const handleDuplicate = useCallback(
    (id: number) => {
      dispatch(DuplicateDesignAction(designList[id].id));
    },
    [designList]
  );

  const handleRename = useCallback(
    (id: number) => {
      changeForm.getField("designName").setValue(designList[id].name);
      setSelDesignId(designList[id].id);
      setOpenChangeName(true);
    },
    [designList]
  );

  const handleChangeDesignName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(
      RenameDesignAction(
        selDesignId,
        changeForm.getField("designName").getValue()
      )
    );
    setOpenChangeName(false);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    SetSearchValue(e.target.value);
  };
  return (
    <div className="w-full h-full px-2">
      <Banner title="Saved Graphics" description="" />

      <div className="h-full w-full md:col-span-10 ">
        {/* Main Content */}
        <main className={`mx-[12px] h-full flex-none transition-all md:pr-2`}>
          <div className="mt-2 font-poppins text-[26px] font-bold text-navy-700 dark:text-white">
            <div className="flex h-[40px] md:w-2/5 sm:w-full mb-4 mt-4 items-center rounded-full bg-lightPrimary text-navy-70">
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
                value={searchValue}
                onChange={handleSearchChange}
                className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400"
              />
            </div>
          </div>
          <div className="h-full">
            <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {designList
                .filter((design) => {
                  if (searchValue == "") return true;
                  return design.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
                    ? true
                    : false;
                })
                .map((design, index) => (
                  <DesignCard
                    image={design.thumbnail}
                    key={index}
                    designId={index}
                    title={design.name}
                    size={design.layer_size}
                    onClick={onTapDesign}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onRename={handleRename}
                  />
                ))}
            </div>
          </div>
        </main>
      </div>
      <ModalDialog
        open={openChangeName}
        onClosed={setOpenChangeName}
        children={
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Change Design Name
            </h3>
            <form className="space-y-6" action="#">
              <div>
                <InputField
                  extra="mb-3"
                  key={"designName"}
                  field={changeForm.getField("designName")}
                  showLabel={true}
                />
              </div>
              <button
                onClick={handleChangeDesignName}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Change
              </button>
            </form>
          </div>
        }
      />
      <ModalDialog
        open={openDeleteConfirm}
        onClosed={setOpenDeleteConfirm}
        children={
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Confirmation
            </h3>
            <p> Do you want to delete this design?</p>
            <div className="mt-4 flex justify-around">
              <button
                onClick={handleConfirmDelete}
                className="w-1/3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Yes
              </button>
              <button
                onClick={() => setOpenDeleteConfirm(false)}
                className="w-1/3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                No
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SavedGraphics;
