import CreateBatch from "../../components/dashboard/gelombangPengajuan/buatGelombangPengajuan";
import Navbar from "../../components/dashboard/navbar";
import Sidebar from "../../components/dashboard/sidebar";

const CreateBatchPage = () => {

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
          <CreateBatch  />
        </main>
      </div>
    </div>
  );
};

export default CreateBatchPage;
