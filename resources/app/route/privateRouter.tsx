import React from "react";
import { Routes, Route } from "react-router-dom";
import UserRootLayout from "@/layouts/UserRootLayout";
import RouteLoading from "@/components/RouteLoading";
import Error404 from "@/components/404";
import SavedGraphics from "@/pages/design/SavedGraphics";
import CreateGraphic from "@/pages/design/CreateGraphic";

const EditorHome = React.lazy(() => import("@/pages/design/EditorHome"));

export default function UserPrivateRoute(props) {
  return (
    <Routes>
      <Route path="/" element={<UserRootLayout />}>
        <Route
          path="/editor"
          element={
            <React.Suspense fallback={<RouteLoading />}>
              <EditorHome />
            </React.Suspense>
          }
        />
        <Route index element={<SavedGraphics />} />
        <Route path="/create-graphic" element={<CreateGraphic />} />
      </Route>
      <Route path="*" element={<Error404 />} />
    </Routes>

    // <div>
    //   {/*<Header/>*/}
    //    <Switch>
    //       <Route exact path={`${props.match.path}/view-profile`} component={Profile}/>
    //       <Route exact path={props.match.path} render={props=> (
    //         <Redirect to={{ pathname: `${props.match.path}/view-profile` }} />
    //       )} />
    //    </Switch>
    // </div>
  );
}
