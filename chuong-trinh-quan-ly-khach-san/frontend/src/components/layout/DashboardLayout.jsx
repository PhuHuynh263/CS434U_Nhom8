import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import GlobalNotifications from "../common/GlobalNotifications";
import { useAuth } from "../../context/AppContext";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: "Quản lý đặt phòng",
      icon: HomeIcon,
      path: "/dashboard/bookings",
      roles: ["admin", "manager", "receptionist"],
    },
    {
      name: "Quản lý khách lưu trú",
      icon: UserGroupIcon,
      path: "/dashboard/customers",
      roles: ["admin", "manager", "receptionist"],
    },
    {
      name: "Quản lý dịch vụ",
      icon: Cog6ToothIcon,
      path: "/dashboard/services",
      roles: ["admin", "manager", "receptionist"],
    },
    {
      name: "Quản lý hóa đơn",
      icon: DocumentTextIcon,
      path: "/dashboard/invoices",
      roles: ["admin", "manager", "receptionist"],
    },
    {
      name: "Quản lý nhân sự & phân quyền",
      icon: UsersIcon,
      path: "/dashboard/staff",
      roles: ["admin", "manager"],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-purple-700">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent
              menuItems={menuItems}
              currentPath={location.pathname}
            />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-purple-700">
          <SidebarContent
            menuItems={menuItems}
            currentPath={location.pathname}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 justify-between items-center px-4 sm:px-6 lg:px-8">
            <button
              className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                Quản Lý Khách Sạn
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.TenNhanVien?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-sm text-gray-700">
                  {user.TenNhanVien || "User"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="text-sm">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Global Notifications */}
      <GlobalNotifications />
    </div>
  );
};

const SidebarContent = ({ menuItems, currentPath }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center px-4 bg-purple-800">
        <h2 className="text-xl font-bold text-white">Hotel Manager</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`${
                isActive
                  ? "bg-purple-800 border-r-4 border-white text-white"
                  : "text-purple-100 hover:bg-purple-600 hover:text-white"
              } group flex w-full items-center px-4 py-3 text-sm font-medium transition-colors duration-200`}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardLayout;
