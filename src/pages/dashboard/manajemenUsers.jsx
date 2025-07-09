import axios from "axios";
import { useEffect, useState } from "react";
import EditUserPopup from "../../components/dashboard/manajemenUser/EditUserPopup";
import UsersTable from "../../components/dashboard/manajemenUser/userTable";
import Navbar from "../../components/dashboard/navbar";
import Sidebar from "../../components/dashboard/sidebar";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Tambahkan loading state

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserRole = currentUser?.role || "";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError("Gagal mengambil data pengguna.");
    } finally {
      setLoading(false); // ✅ Hentikan loading setelah fetch selesai
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    try {
      await axios.delete(`${baseUrl}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
      alert("User berhasil dihapus.");
    } catch (err) {
      setError("Gagal menghapus pengguna.");
      alert("Gagal menghapus user.");
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div className="p-6 flex-grow relative">
          {/* 🔄 Spinner saat loading */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
                <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                <span className="text-blue-700 font-medium">Memuat data pengguna...</span>
              </div>
            </div>
          )}

          {/* Konten utama ditampilkan setelah loading selesai */}
          {!loading && (
            <main className="flex-1 overflow-y-auto">
              <h1 className="text-2xl font-semibold mb-4 text-[#272C7D]">
                Manajemen Pengguna
              </h1>

              {error && <p className="text-red-600 mb-4">{error}</p>}

              <UsersTable
                users={users}
                currentUserRole={currentUserRole}
                onEdit={setEditingUser}
                onDelete={handleDelete}
              />
            </main>
          )}
        </div>
      </div>

      {editingUser && (
        <EditUserPopup
          user={editingUser}
          baseUrl={baseUrl}
          token={token}
          onClose={() => setEditingUser(null)}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default ManageUsers;
