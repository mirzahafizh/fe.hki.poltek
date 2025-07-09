import axios from "axios";
import { useState } from "react";
const EditUserPopup = ({ user, baseUrl, token, onClose, onUpdate }) => {
  const [role, setRole] = useState(user.role);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    await axios.put(
      `${baseUrl}/users/${user.id}`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    onUpdate({ ...user, role });
    alert("Berhasil memperbarui data user.");  // alert berhasil
    onClose();
  } catch (err) {
    console.error(err.response?.data || err.message || err);
    setError("Gagal memperbarui data user.");
    alert("Gagal memperbarui data user."); // alert gagal
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Role User</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="role" className="block font-medium mb-1">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPopup;