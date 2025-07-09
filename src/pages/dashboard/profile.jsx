import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../../components/dashboard/navbar";
import Sidebar from "../../components/dashboard/sidebar";
import EditProfilePopup from "../../components/users/editProfile";
import ChangePasswordPopup from "../../components/users/UbahPassword";

const ProfileDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ State loading
  const [showEdit, setShowEdit] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !token) {
        console.error("User atau token tidak tersedia.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/users/${storedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      } finally {
        setLoading(false); // ⬅️ Selesai fetch, matikan loading
      }
    };

    fetchProfile();
  }, [API_URL, token]);

  const formatTanggalLahir = (tgl) => {
    if (!tgl) return "-";
    const date = new Date(tgl);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Spinner loading
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <span className="text-blue-700 font-medium">Memuat data pengguna...</span>
        </div>
      </div>
    );
  }

  if (!user) return <div className="p-6">Profil tidak ditemukan.</div>;

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 mt-16 w-full mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-8">
            {/* Sidebar kiri */}
            <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
              {user.image ? (
                <img
                  src={user.image}
                  alt={`${user.username} profile`}
                  className="w-64 h-64 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-white text-3xl mb-4">
                  👤
                </div>
              )}

              <h2 className="text-xl font-semibold mb-2 text-center">{user.username}</h2>

              <button
                onClick={() => setShowEdit(true)}
                className="w-full bg-[#272C7D] text-white py-2 rounded mb-2 hover:bg-[#1f2364]"
              >
                Edit Profil
              </button>
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              >
                Ubah Password
              </button>
            </div>

            {/* Konten kanan */}
            <div className="w-full md:w-2/3">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Informasi Pengguna</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jenis Kelamin</p>
                  <p className="font-medium">{user.jenisKelamin || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">No. Telepon</p>
                  <p className="font-medium">{user.nomorHp || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Lahir</p>
                  <p className="font-medium">{formatTanggalLahir(user.tanggalLahir)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popup Edit Profil */}
        {showEdit && (
          <EditProfilePopup
            user={user}
            token={token}
            onClose={() => setShowEdit(false)}
            onUpdate={(updatedUser) => setUser(updatedUser)}
          />
        )}

        {/* Popup Ubah Password */}
        {showChangePassword && (
          <ChangePasswordPopup
            userId={user.id}
            token={token}
            onClose={() => setShowChangePassword(false)}
            onSuccess={() => {
              alert("Password berhasil diubah.");
              setShowChangePassword(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileDashboard;
