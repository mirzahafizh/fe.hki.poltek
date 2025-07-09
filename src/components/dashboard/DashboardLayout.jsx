// src/components/DashboardLayout.jsx
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 bg-gray-100 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
