import React, {
  ChangeEvent,
  forwardRef,
  ForwardRefRenderFunction,
  useRef,
} from "react";
import PlayCircleIcon from "@duyank/icons/regular/PlayCircle";
import { useEditor } from "@lidojs/editor";
import { useAppSelector, useAppDispatch } from "@/store/hooks";

interface HeaderLayoutProps {
  openChangeName: () => void;
}
const HeaderLayout: ForwardRefRenderFunction<
  HTMLDivElement,
  HeaderLayoutProps
> = ({ openChangeName }, ref) => {
  const uploadRef = useRef<HTMLInputElement>(null);
  const { actions, query } = useEditor();
  const curDesignName = useAppSelector((state) => state.designs.curDesignName);
  const subscribed = useAppSelector(
    (state) =>
      state.auth.authUser &&
      state.auth.authUser.active &&
      !state.auth.authUser.cancelled
  );

  const handleSave = () => {
    const saveTime = String(Date.now());
    actions.saveDesign(saveTime);
  };

  return (
    <div
      ref={ref}
      css={{
        background: "#ddd",
        padding: "12px 32px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        "@media (max-width: 900px)": {
          padding: 12,
        },
      }}
    >
      <div
        className="w-full"
        css={{
          color: "#3d8eff",
          fontSize: 36,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div css={{ color: "black", display: "flex", alignItems: "center" }}>
          {/* <img src={"./assets/logo.png"} css={{ maxHeight: "100%" }} /> */}
          <div className="text-2xl">{curDesignName}</div>
          <div
            className="w-8 h-8 ml-4 mt-2 hover:cursor-pointer"
            onClick={() => openChangeName()}
          >
            <img
              className="w-4 h-4 mt-2"
              src="/assets/icons/icon_edit.png"
            ></img>
          </div>
        </div>
      </div>
      <div css={{ display: "flex", alignItems: "center" }}>
        {subscribed && (
          <div
            className="px-2.5 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-800"
            css={{
              margin: "0 16px",
              cursor: "pointer",
              color: "#fff",
              fontWeight: 700,
              ":hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleSave}
          >
            Save
          </div>
        )}
      </div>
    </div>
  );
};

export default forwardRef(HeaderLayout);
