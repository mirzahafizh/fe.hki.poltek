import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Headbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [targetPath, setTargetPath] = useState("");
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false); // status batch
  const dropdownRefs = {
    dashboard: useRef(null),
    hakcipta: useRef(null),
    paten: useRef(null),
  };

  const navigate = useNavigate();

  // Ambil status batch saat mount
useEffect(() => {
const fetchBatchStatus = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/batches`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
console.log("response.data", response.data);

const now = new Date();
now.setHours(0, 0, 0, 0); // Normalize waktu ke awal hari

// Cek apakah ada batch yang aktif
const isAnyBatchOpen = response.data.some(batch => {
  const start = new Date(batch.tanggal_mulai);
  const end = new Date(batch.tanggal_selesai);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return now >= start && now <= end;
});

setIsSubmissionOpen(isAnyBatchOpen);

  } catch (error) {
    console.error("Gagal memeriksa status batch:", error);
    setIsSubmissionOpen(false);
  }
};



  fetchBatchStatus();
}, []);


  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.entries(dropdownRefs).forEach(([key, ref]) => {
        if (ref.current && !ref.current.contains(event.target)) {
          if (openDropdown === key) setOpenDropdown(null);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  // Fungsi untuk handle klik "Usulan Baru" dengan pengecekan batch
  const handleUsulanClick = (path) => {
    if (!isSubmissionOpen) {
      alert("Pengajuan saat ini sedang ditutup.");
      return;
    }
    setTargetPath(path);
    setShowModal(true);
    setOpenDropdown(null); // tutup dropdown saat modal muncul
  };

  const handleConfirm = () => {
    setShowModal(false);
    navigate(targetPath);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-[#272C7D] text-white px-6 py-3 flex items-center space-x-8 shadow-md">
        {/* Dashboard */}
<Link
  to="/home"
  className="hover:text-gray-300 font-semibold"
>
  Dashboard
</Link>


        {/* Hak Cipta */}
        <div className="relative" ref={dropdownRefs.hakcipta}>
          <button
            onClick={() => toggleDropdown("hakcipta")}
            className="hover:text-gray-300 font-semibold"
          >
            Hak Cipta ▾
          </button>
          {openDropdown === "hakcipta" && (
            <div className="absolute mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
              <button
                onClick={() => handleUsulanClick("/hakcipta/usulan")}
                disabled={!isSubmissionOpen}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  isSubmissionOpen
                    ? "hover:bg-gray-100 cursor-pointer"
                    : "cursor-not-allowed text-gray-400"
                }`}
              >
                Usulan Baru
              </button>
              <Link
                to="/hakcipta/riwayat"
                className="block px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Riwayat
              </Link>
            </div>
          )}
        </div>

        {/* Paten */}
        <div className="relative" ref={dropdownRefs.paten}>
          <button
            onClick={() => toggleDropdown("paten")}
            className="hover:text-gray-300 font-semibold"
          >
            Paten ▾
          </button>
          {openDropdown === "paten" && (
            <div className="absolute mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
              <button
                onClick={() => handleUsulanClick("/paten/usulan")}
                disabled={!isSubmissionOpen}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  isSubmissionOpen
                    ? "hover:bg-gray-100 cursor-pointer"
                    : "cursor-not-allowed text-gray-400"
                }`}
              >
                Usulan Baru
              </button>
              <Link
                to="/paten/riwayat"
                className="block px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Riwayat
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Penting!</h3>
            <p className="mb-4">
              Pastikan email dan nomor HP Anda aktif. Kode billing akan diberikan melalui email dan WhatsApp.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Headbar;
