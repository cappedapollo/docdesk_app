import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminRootLayout from "@/layouts/AdminRootLayout";
import Error404 from "@/components/404";

export default function AdminRoute(props) {
  return (
    <Routes>
      <Route path="/" element={<AdminRootLayout />}>
        {/* <Route index element={<SavedGraphics />} />
        <Route path="/create-graphic" element={<CreateGraphic />} />
        <Route path="/go-pro" element={<GoPro />} />
        <Route path="/payment/:plan" element={<Payment />} /> */}
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
