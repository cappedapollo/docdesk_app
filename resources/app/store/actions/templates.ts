import { templateList } from "@/service/templates";
import { setLoading, setNotifyMsg } from "@/store/reducers/share";
import { setTemplates } from "@/store/reducers/templates";

export const LoadTemplateListAction = (data: unknown) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const {
        data: { success, templates, message },
      } = await templateList(data);
      dispatch(setTemplates(templates));
      dispatch(setNotifyMsg(message));
    } catch (e) {
      dispatch(setNotifyMsg(e.message));
    }
    dispatch(setLoading(false));
  };
};
