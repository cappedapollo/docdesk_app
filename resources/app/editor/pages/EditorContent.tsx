import { useCallback, useMemo } from "react";
import { DesignFrame } from "@lidojs/editor";
import { useEditor } from "@lidojs/editor";
import { SaveDesignAction } from "@/store/actions/design";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getWaterMarkedData, sampleData } from "../data";

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
      !state.auth.authUser.ended
  );

  const saveThumbnail = useCallback(
    (thumbnailImg: Blob | null) => {
      let q = JSON.parse(JSON.stringify(query.serialize()));
      Object.keys(q[0].layers).forEach((id) => {
        if (q[0].layers[id].waterMark) {
          delete q[0].layers[id];
          q[0].layers.ROOT.child = q[0].layers.ROOT.child.filter(
            (k: string) => k !== id
          );
        }
      });
      dispatch(SaveDesignAction(curDesignId, curDesignName, thumbnailImg, q));
    },
    [curDesignId, curDesignName, query]
  );

  const data = useMemo(() => {
    const d = pageData || sampleData;
    return !subscribed ? getWaterMarkedData(JSON.parse(JSON.stringify(d))) : d;
  }, [subscribed, pageData]);

  return <DesignFrame data={data} onSavedThumbnail={saveThumbnail} />;
};

export default EditorContent;
