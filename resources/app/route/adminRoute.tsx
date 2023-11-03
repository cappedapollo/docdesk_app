import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminRootLayout from "@/layouts/AdminRootLayout";
import Error404 from "@/components/404";
import Users from "@/pages/admin/Users";
import Templates from "@/pages/admin/Templates";

export default function AdminRoute(props) {
  return (
    <Routes>
      <Route path="/" element={<AdminRootLayout />}>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<Users />} />
        <Route path="/templates" element={<Templates />} />
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
