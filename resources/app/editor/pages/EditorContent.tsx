import React, { useCallback } from "react";
import { data } from "../data";
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
  const { actions, query } = useEditor();
  const dispatch = useAppDispatch();
  const curDesignId = useAppSelector((state) => state.designs.curDesignId);
  const curDesignName = useAppSelector((state) => state.designs.curDesignName);

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
      data={data} //ageData == null ? data : pageData}
      onSavedThumbnail={saveThumbnail}
    />
  );
};

export default EditorContent;
