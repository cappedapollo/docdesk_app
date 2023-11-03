import axios from "@/service/service";
import { BASE_URL } from "@/service/service";
import { useAppDispatch } from "@/store/hooks";
import { setNotifyMsg } from "@/store/reducers/share";
import { useState, useEffect, useCallback } from "react";
import { useAsync } from "react-use";
import Pagination from "rc-pagination";

const Users = () => {
  return (
    <div className="w-full p-4">
      <Pagination />
    </div>
  );
};

export default Users;
