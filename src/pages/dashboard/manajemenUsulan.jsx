import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReviewModal from "../../components/dashboard/manajemenUsulan/ReviewModal";
import SubmissionTable from "../../components/dashboard/manajemenUsulan/SubmissionTable";
import Navbar from "../../components/dashboard/navbar";
import Sidebar from "../../components/dashboard/sidebar";

const ManajemenAjuan = () => {
  const location = useLocation();
  const [submissionData, setSubmissionData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("disubmit");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [formReview, setFormReview] = useState({
    pesanReview: "",
    statusReview: "revisi",
    namaReviewer: "",
  });
  const [loading, setLoading] = useState(true); // ✅ loading default true

  // Ambil query param status dari URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusFromUrl = params.get("status");
    setFilterStatus(statusFromUrl || "disubmit");
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = `${import.meta.env.VITE_API_URL}/submissions`;

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSubmissionData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data submission:", error);
      } finally {
        setLoading(false); // ✅ loading selesai
      }
    };

    fetchData();
  }, []);

  const filteredData = submissionData.filter(
    (item) => item.statusSubmission === filterStatus
  );

  const openReviewModal = (submission) => {
    setSelectedSubmission(submission);
    setFormReview({
      pesanReview: "",
      statusReview: "revisi",
      namaReviewer: "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async () => {
    if (!selectedSubmission) return;

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !user.id || !token) {
        alert("User belum login.");
        setLoading(false);
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/reviews`,
        {
          ...formReview,
          submissionId: selectedSubmission.id,
          userId: selectedSubmission.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review berhasil disimpan.");
      setSubmissionData((prev) =>
        prev.map((item) =>
          item.id === selectedSubmission.id
            ? { ...item, statusSubmission: formReview.statusReview }
            : item
        )
      );

      closeModal();
    } catch (error) {
      console.error("Gagal menyimpan review:", error);
      alert("Gagal menyimpan review.");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 relative">

          {/* ✅ Spinner saat loading */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
                <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                <span className="text-blue-700 font-medium">
                  Memuat data ajuan...
                </span>
              </div>
            </div>
          )}

          {/* ✅ Konten utama tampil setelah loading */}
          {!loading && (
            <>
              <h1 className="text-2xl font-bold mb-4">Manajemen Ajuan</h1>

              <SubmissionTable
                data={filteredData}
                onReviewClick={openReviewModal}
              />

              {modalOpen && (
                <ReviewModal
                  selectedSubmission={selectedSubmission}
                  formReview={formReview}
                  handleInputChange={handleInputChange}
                  handleSubmitReview={handleSubmitReview}
                  closeModal={closeModal}
                  loading={loading}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManajemenAjuan;
