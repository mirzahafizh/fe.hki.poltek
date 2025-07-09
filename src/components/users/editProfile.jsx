import axios from "axios";
import { useState } from "react";

const EditProfilePopup = ({ user, token, onClose, onUpdate }) => {
  // Initialize form state with user data
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    nomorHp: user.nomorHp || "",
    jenisKelamin: user.jenisKelamin || "",
    tanggalLahir: user.tanggalLahir ? user.tanggalLahir.split("T")[0] : "",
    imageFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change (text, email, date, select)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const API_URL = import.meta.env.VITE_API_URL;

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const data = new FormData();

    // Tambahkan _method agar Laravel tahu ini adalah PUT
    data.append("_method", "PUT");

    // Tambahkan field-field yang dikirim
    if (formData.username) data.append("username", formData.username);
    if (formData.email) data.append("email", formData.email);
    if (formData.nomorHp) data.append("nomorHp", formData.nomorHp);
    if (formData.jenisKelamin) data.append("jenisKelamin", formData.jenisKelamin);
    if (formData.tanggalLahir) data.append("tanggalLahir", formData.tanggalLahir);
    if (formData.imageFile) data.append("file", formData.imageFile);

    // Debug log
    console.log(`${API_URL}/users/${user.id}`);

    // Kirim sebagai POST (dengan override ke PUT)
    const res = await axios.post(`${API_URL}/users/${user.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    onUpdate(res.data.user); // Update user di parent
    onClose(); // Tutup popup/modal
  } catch (err) {
    setError(err.response?.data?.error || "Gagal update profil");
    console.error(err.response); // Tambahkan log error
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Profil</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="nomorHp"
            placeholder="Nomor HP"
            value={formData.nomorHp}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="jenisKelamin"
            value={formData.jenisKelamin}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>

          <input
            type="date"
            name="tanggalLahir"
            value={formData.tanggalLahir}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <div>
            <label className="block mb-1 font-medium">Foto Profil</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#272C7D] text-white py-2 rounded hover:bg-[#1f2364]"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopup;
