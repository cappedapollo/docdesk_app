import axios from "@/service/service";
import { BASE_URL } from "@/service/service";
import { useAppDispatch } from "@/store/hooks";
import { setNotifyMsg } from "@/store/reducers/share";
import { useState, useEffect, useCallback } from "react";
import { useAsync } from "react-use";

const Templates = () => {
  return <div className="w-full h-full px-2 py-8"></div>;
};

export default Templates;
