import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { useState, useCallback } from "react";
import axios, { BASE_URL } from "@/service/service";
import { useAsync } from "react-use";
import PartialLoading from "@/components/PartialLoading";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { SpoofingAction } from "@/store/actions/auth";
import TemplateCard from "@/components/card/TemplateCard";
import { sampleData } from "@/editor/data";

const inintalPaginationSettting = {
  current: 1,
  pageSize: 10,
};

interface PaginationDataProp {
  data: any[];
  total: number;
}

const Templates = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<Boolean>(false);
  const [paginatedData, setPaginatedData] = useState<PaginationDataProp>({
    data: [],
    total: 0,
  });
  const [paginationSetting, setPaginationSetting] = useState(
    inintalPaginationSettting
  );
  const [searchText, setSearchText] = useState("");
  const onChange = (current: number, pageSize: number) => {
    setPaginationSetting((draft) => ({ ...draft, current, pageSize }));
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPaginationSetting((draft) => ({ ...draft, pageSize: e.target.value }));
  };

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  useAsync(async () => {
    setLoading(true);
    const res = await axios.get(BASE_URL + "/admin/templates", {
      params: { ...paginationSetting, search: searchText },
    });
    setLoading(false);
    setPaginatedData(res.data);
  }, [searchText, paginationSetting]);

  const onTapTemplate = useCallback(
    (id: number) => {
      console.log(id);
      const pageData = JSON.parse(paginatedData.data[id].data);
      navigate("/admin/template-editor", {
        state: {
          curDesignId: paginatedData.data[id].id,
          curDesignName: paginatedData.data[id].name,
          pageData: [pageData],
        },
      });
    },
    [paginatedData.data]
  );

  const handleClickCreate = () => {
    navigate("/admin/template-editor", {
      state: {
        curDesignId: -1,
        curDesignName: "New Template",
        pageData: sampleData,
      },
    });
  };

  return (
    <div className="w-full p-4 relative">
      {loading && <PartialLoading />}
      <div className="flex justify-between">
        <Pagination
          onChange={onChange}
          pageSizeOptions={["10", "20", "50", "100"]}
          showTotal={(total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total}`
          }
          total={paginatedData && paginatedData.total}
          {...paginationSetting}
        />
        <select className="border mx-2" onChange={onPageSizeChange}>
          <option>10</option>
          <option>20</option>
          <option>50</option>
        </select>
        <div className="grow"></div>
        <input
          className="border focus:outline-none px-2"
          placeholder="Please input search."
          onChange={onSearch}
        />
        <button
          className="bg-teal-600 text-white  px-4 hover:bg-teal-800 ml-2"
          onClick={handleClickCreate}
        >
          Create
        </button>
      </div>

      <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 mt-4">
        {paginatedData.data &&
          paginatedData.data.map((template, index) => (
            <TemplateCard
              key={index}
              templateId={index}
              image={template.img}
              title={template.name}
              size={template.layer_size}
              onClick={onTapTemplate}
            />
          ))}
      </div>
    </div>
  );
};

export default Templates;
