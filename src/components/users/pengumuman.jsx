import axios from "axios";
import { useEffect, useState } from "react";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
const fetchAnnouncements = async () => {
  try {
    const token = localStorage.getItem("token"); // atau dari context/state sesuai implementasi kamu

    const res = await axios.get("http://127.0.0.1:8000/api/announcements", {
      headers: {
      },
    });

    setAnnouncements(res.data);
  } catch (err) {
    console.error("Gagal mengambil pengumuman:", err);
  }
};


    fetchAnnouncements();
  }, []);

  return (
    <div className="p-6 max-w-8xl ">
      <h1 className="text-xl font-semibold text-white bg-[#272C7D] inline-block px-4 py-2 rounded mb-4">
        Pengumuman Terbaru
      </h1>


      {announcements.length === 0 ? (
        <p className="text-gray-600">Belum ada pengumuman.</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map((item, index) => (
            <li key={index} className="bg-white p-4 shadow rounded-lg border border-gray-200">
              <h2 className="font-semibold text-lg text-[#272C7D]">{item.judul}</h2>
              <p className="text-gray-700 mt-1">{item.deskripsi}</p>
              <p className="text-sm text-gray-400 mt-2">{new Date(item.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Announcement;
