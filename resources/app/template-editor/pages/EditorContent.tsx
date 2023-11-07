import { useCallback, useMemo } from "react";
import { DesignFrame } from "@lidojs/editor";
import { useEditor } from "@lidojs/editor";
import { useAppDispatch } from "@/store/hooks";
import { sampleData } from "../data";
import { SaveTemplateAction } from "@/store/actions/templates";

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

      dispatch(
        SaveTemplateAction(curDesignId, curDesignName, thumbnailImg, q[0])
      );
    },
    [curDesignId, curDesignName, query]
  );

  const data = useMemo(() => {
    return pageData || sampleData;
  }, [pageData]);

  return <DesignFrame data={data} onSavedThumbnail={saveThumbnail} />;
};

export default EditorContent;
