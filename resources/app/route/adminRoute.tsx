import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminRootLayout from "@/layouts/AdminRootLayout";
import Error404 from "@/components/404";
import Users from "@/pages/admin/users/list";
import Templates from "@/pages/admin/templates/list";
import UserEdit from "@/pages/admin/users/edit";

export default function AdminRoute(props) {
  return (
    <Routes>
      <Route path="/" element={<AdminRootLayout />}>
        <Route path="/" element={<Navigate to="/admin/users" replace />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/edit/:id" element={<UserEdit />} />
        <Route path="/templates" element={<Templates />} />
      </Route>
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}
