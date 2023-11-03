import { useCallback } from "react";
import { sampleData } from "../data";
import { DesignFrame } from "@lidojs/editor";
import { useEditor } from "@lidojs/editor";
import { SaveDesignAction } from "@/store/actions/design";
import { useAppSelector, useAppDispatch } from "@/store/hooks";

const EditorContent = (props: {
  pageData?: any;
  id: number;
  designName: string;
}) => {
  const { pageData } = props;
  const { query } = useEditor();
  const dispatch = useAppDispatch();

  const curDesignId = props.id;
  const curDesignName = props.designName;
  // const curDesignId = useAppSelector((state) => state.designs.curDesignId);
  // const curDesignName = useAppSelector((state) => state.designs.curDesignName);

  const subscribed = useAppSelector(
    (state) =>
      state.auth.authUser &&
      state.auth.authUser.active &&
      !state.auth.authUser.cancelled
  );

  const saveThumbnail = useCallback(
    (thumbnailImg: Blob | null) => {
      dispatch(
        SaveDesignAction(
          curDesignId,
          curDesignName,
          thumbnailImg,
          query.serialize()
        )
      );
    },
    [curDesignId, curDesignName, query]
  );

  return (
    <DesignFrame
      data={pageData || sampleData}
      onSavedThumbnail={saveThumbnail}
      subscribed={subscribed}
    />
  );
};

export default EditorContent;
