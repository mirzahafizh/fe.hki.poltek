import axios from "axios";
import { useEffect, useState } from "react";
import { FiCalendar } from "react-icons/fi";
const Pengumuman = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL + "/announcements";

  // Fungsi format tanggal ke "26 Mei 2025"
  function formatTanggalIndo(dateString) {
    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const date = new Date(dateString);
    const day = date.getDate();
    const monthName = bulan[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${monthName} ${year}`;
  }

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        // Urutkan data berdasarkan createdAt terbaru dulu
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        // Ambil 3 teratas
        setAnnouncements(sorted.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil pengumuman:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container-pengumuman mt-2 mx-auto w-11/12 sm:w-4/5 p-6 ">
      <h1 className="text-center text-2xl font-semibold uppercase font-mono">
        Pengumuman Terbaru
      </h1>
      <div className="w-[90px] h-2 bg-[#DA2329] rounded-xl mx-auto mt-2"></div>
      <h2 className="text-center mt-4 text-sm text-gray-700">
        Pengumuman terbaru terkait dengan aturan maupun informasi Kekayaan
        Intelektual
      </h2>

      {/* Cards Horizontal */}
<div className="mt-6 flex flex-row justify-center overflow-x-auto pb-4">
  {loading ? (
    <p className="text-center w-full">Memuat pengumuman...</p>
  ) : announcements.length === 0 ? (
    <p className="text-center w-full">Tidak ada pengumuman saat ini.</p>
  ) : (
    announcements.map((item, index) => (
      <div
        key={index}
        className="flex-shrink-0 bg-white shadow-md rounded-lg p-4 w-72 mx-2 border border-gray-400 hover:shadow-lg transition duration-300"
      >
        <div className="border-b border-gray-300 p-2 mb-3">
          <h3 className="text-lg font-semibold text-[#272C7D]">{item.judul}</h3>
        </div>
        <div className="border-b border-gray-300 p-2 mb-3">
          <p className="text-[16px] text-black mb-3">{item.deskripsi}</p>
        </div>
        <div className="pt-2">
          <p className="text-[14px] text-center text-black flex items-center justify-center space-x-2">
            <FiCalendar />
            <span>{formatTanggalIndo(item.created_at)}</span>
          </p>
        </div>
      </div>
    ))
  )}
</div>

    </div>
  );
};

export default Pengumuman;
