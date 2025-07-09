import axios from "axios";
import { useEffect, useState } from "react";

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/announcements`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnnouncements(response.data);
    } catch (err) {
      setError("Gagal memuat pengumuman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus pengumuman ini?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/announcements/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Gagal menghapus pengumuman.");
    }
  };

  return (
  <div className="relative p-6">
    {/* Spinner saat loading */}
    {loading ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <span className="text-blue-700 font-medium">Memuat data pengumuman...</span>
        </div>
      </div>
    ) : (
      <>
        <h2 className="text-2xl font-bold mb-4">Manajemen Pengumuman</h2>

        {error ? (
          <p className="text-red-600">{error}</p>
        ) : announcements.length === 0 ? (
          <p>Tidak ada pengumuman.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr className="bg-[#272C7D] text-white">
                  <th className="border px-4 py-2 text-left">Judul</th>
                  <th className="border px-4 py-2 text-left">Deskripsi</th>
                  <th className="border px-4 py-2 text-left">Dibuat Oleh</th>
                  <th className="border px-4 py-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="border px-4 py-2 font-medium">{item.judul}</td>
                    <td className="border px-4 py-2">{item.deskripsi}</td>
                    <td className="border px-4 py-2">
                      {item.user?.username || "Tidak diketahui"}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center justify-center px-2 sm:px-3 py-1 sm:py-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs sm:text-sm w-[80px]"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    )}
  </div>
);

};

export default AnnouncementManagement;
