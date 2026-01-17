"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import MovieIcon from "@mui/icons-material/Movie";
import SendIcon from "@mui/icons-material/Send";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

import SidebarDropdown from "../components/slider/SidebarDropdown";
import PostDropdown from "../components/slider/PostDropdown";

const menuItems = [
  { label: "Home", icon: HomeIcon, path: "/" },
  { label: "Search", icon: SearchIcon, path: "/search" },
  { label: "Reels", icon: MovieIcon, path: "/reels" },
  { label: "Create", type: "create" },
  { label: "Messages", icon: SendIcon, path: "/messages",  },
  { label: "Notifications", icon: FavoriteBorderIcon, path: "/notifications" },
  { label: "Profile", icon: AccountCircleIcon, path: "/profile" },
  { label: "More", icon: MenuIcon, type: "more" },
];

function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        setExpanded(false);
        setMoreOpen(false);
      }}
      className={`fixed left-0 top-0 z-50 h-screen bg-white shadow-md
        transition-all duration-300 flex flex-col
        ${expanded ? "w-64" : "w-20"}`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
  {expanded && (
    <span
  className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent"
  style={{
    backgroundImage:
      "linear-gradient(90deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
  }}
>
  Tripathi
</span>

  )}
</div>


      {/* Menu */}
      <nav className="flex flex-col gap-2 p-3 flex-1 relative">
        {menuItems.map((item) => {
          // CREATE
          if (item.type === "create") {
            return <PostDropdown key="create" expanded={expanded} />;
          }

          // MORE
          if (item.type === "more") {
            const Icon = item.icon;
            return (
              <div key="more" className="relative">
                <button
                  onClick={() => setMoreOpen((prev) => !prev)}
                  className="flex w-full items-center gap-4 px-3 py-3 rounded-lg
                             hover:bg-gray-100 transition group"
                >
                  <Icon className="text-3xl text-gray-700 group-hover:text-black" />
                  {expanded && (
                    <span className="text-sm font-medium">More</span>
                  )}
                </button>

                <SidebarDropdown
                  open={moreOpen}
                  setOpen={setMoreOpen}
                />
              </div>
            );
          }

          // NORMAL
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center gap-4 px-3 py-3 rounded-lg
                ${isActive
                  ? "bg-gray-100 font-semibold"
                  : "hover:bg-gray-100"} 
                transition group`}
            >
              {item.label === "Profile" && user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <Icon className="text-3xl text-gray-700 group-hover:text-black" />
              )}

              {expanded && (
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              )}

              {expanded && item.badge && (
                <span className="ml-auto text-xs bg-red-500 text-white px-2 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
