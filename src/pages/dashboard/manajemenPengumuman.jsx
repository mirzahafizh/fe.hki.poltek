import AnnouncementManagement from "../../components/dashboard/manajemenPengumuman/manajemenPengumuman";
import Navbar from "../../components/dashboard/navbar";
import Sidebar from "../../components/dashboard/sidebar";

const AnnouncementPage = () => {

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnnouncementManagement  />
        </main>
      </div>
    </div>
  );
};

export default AnnouncementPage;
