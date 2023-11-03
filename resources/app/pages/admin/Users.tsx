import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

const Users = () => {
  const onChange = (current, pageSize) => {
    console.log(current, pageSize);
  };
  return (
    <div className="w-full p-4">
      <Pagination
        // current={2}
        total={1000}
        pageSize={10}
        onChange={onChange}
        pageSizeOptions={["10", "20", "50", "100"]}
        showTotal={(_total, [from, to]) => `${from} - ${to} of ${_total} cnt`}
      />
    </div>
  );
};

export default Users;
