import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

export default function AdminRootLayout(props: { children?: ReactNode }) {
  return (
    <main className="">
      {props.children}
      <Outlet />
    </main>
  );
}
