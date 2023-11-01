import { useCallback, useMemo } from "react";
import { sampleData, waterMarkUnitData } from "../data";
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

  const designData = useMemo(() => {
    const d = pageData ? sampleData : sampleData;
    let childKeys = [];
    let childLayers = {};
    const time = new Date().getTime();

    const MAX_WIDTH = 3000;
    const MAX_HEIGHT = 1800;
    const rowCnt = Math.ceil(MAX_WIDTH / waterMarkUnitData.props.boxSize.width);
    const colCnt = Math.ceil(
      MAX_HEIGHT / waterMarkUnitData.props.boxSize.height
    );

    for (let i = 0; i < rowCnt; i++) {
      for (let j = 0; j < colCnt; j++) {
        const k = time + `row${i}col${j}`;
        const t = JSON.parse(JSON.stringify(waterMarkUnitData));
        t.props.position = {
          x: t.props.boxSize.width * i,
          y: t.props.boxSize.height * j,
        };

        childKeys.push(k);
        childLayers = { ...childLayers, [k]: t };
      }
    }
    d[0].layers["0-waterMark"].child = childKeys;
    d[0].layers = { ...d[0].layers, ...childLayers };

    return d;
  }, []);

  return <DesignFrame data={designData} onSavedThumbnail={saveThumbnail} />;
};

export default EditorContent;
