import axios from "axios";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import CustomNavbar from "../components/Navbar";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL + "/announcements";

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setAnnouncements(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil pengumuman:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen ">
      <CustomNavbar />

      <main className="flex-grow flex justify-center mt-10 px-4 w-full ">
        <div className="p-6 max-w-9xl w-full bg-gray-200 rounded-md shadow-md mb-8">
          <h1 className="text-xl font-semibold text-white bg-[#272C7D] inline-block px-4 py-2 rounded mb-6">
            Pengumuman Terbaru
          </h1>

          {loading ? (
            <p className="text-gray-600">Memuat pengumuman...</p>
          ) : announcements.length === 0 ? (
            <p className="text-gray-600">Belum ada pengumuman.</p>
          ) : (
            <ul className="space-y-6 w-full">
              {announcements.map((item, index) => (
                <li
                  key={index}
                  className="bg-white p-6 shadow-lg rounded-lg border border-gray-300 w-full"
                >
                  <h2 className="font-semibold text-lg text-[#272C7D]">
                    {item.judul}
                  </h2>
                  <p className="text-gray-700 mt-2">{item.deskripsi}</p>
                  <p className="text-sm text-gray-400 mt-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Announcement;
