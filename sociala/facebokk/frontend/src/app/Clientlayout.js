"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { fetchUser } from "../redux/slices/authslice";
import { ToastContainer } from "react-toastify";

import SidebarWrapper from "./components/SidebarWrapper";
import SocketListener from "./components/hooks/SocketListener";
import ChatSocketComponent from "./components/hooks/useChatSocket"; // default export component

const ClientLayout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { authChecked, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const hasFetchedRef = useRef(false);

  /* 🔥 SIDEBAR CONTROL */
  const hideSidebarRoutes = ["/auth/login", "/auth/register"];
  const hideSidebar = hideSidebarRoutes.includes(pathname);

  /* 🔄 Fetch user once */
  useEffect(() => {
    if (!hasFetchedRef.current && !authChecked) {
      hasFetchedRef.current = true;
      console.log("🔹 Fetching user for the first time");
      dispatch(fetchUser());
    }
  }, [authChecked, dispatch]);

  /* 🔐 Redirect unauthenticated users */
  useEffect(() => {
    if (authChecked && !isAuthenticated && !hideSidebar) {
      console.log("⚠️ User not authenticated, redirecting to login");
      router.replace("/auth/login");
    }
  }, [authChecked, isAuthenticated, hideSidebar, router]);

  /* ⏳ Prevent UI flicker */
  if (!authChecked && !hideSidebar) return null;

  /* 🔥 Pages without sidebar */
  if (hideSidebar) {
    return (
      <>
        {children}
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </>
    );
  }

  /* 🔥 Default layout */
  return (
    <>
      <div className="flex min-h-[100dvh] bg-gray-50">
        {isAuthenticated && <SidebarWrapper />}
        <main className="flex-1">{children}</main>
      </div>

      {/* ✅ Global socket listeners */}
      {isAuthenticated && <SocketListener />}
      {isAuthenticated && <ChatSocketComponent />}

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
};

export default ClientLayout;
