import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/dashboard/navbar";
import Sidebar from "../../components/dashboard/sidebar";

const RegisterAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    nomorHp: "",
    jenisKelamin: "Laki-laki",
    tanggalLahir: "",
    role: "admin",
  });

  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post(`${baseUrl}/users/register`, formData);
    alert("Pendaftaran berhasil!");

    // Reset form
    setFormData({
      username: "",
      email: "",
      password: "",
      nomorHp: "",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "",
      role: "admin",
    });

    navigate("/register-admin");
  } catch (err) {
    setError(err.response?.data?.error || "Pendaftaran gagal.");
  }
};


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-grow flex items-center justify-center p-6">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-5">
            <h2 className="text-3xl font-semibold text-center text-[#272C7D]">Daftar Admin</h2>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#272C7D] focus:border-transparent"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#272C7D] focus:border-transparent"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#272C7D] focus:border-transparent"
            />

            <input
              type="text"
              name="nomorHp"
              placeholder="Nomor HP"
              value={formData.nomorHp}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#272C7D] focus:border-transparent"
            />

            <select
              name="jenisKelamin"
              value={formData.jenisKelamin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#272C7D] focus:border-transparent"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>

            <input
              type="date"
              name="tanggalLahir"
              required
              value={formData.tanggalLahir}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#272C7D] focus:border-transparent"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#272C7D] focus:border-transparent"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>

            <button
              type="submit"
              className="w-full bg-[#272C7D] text-white py-2 rounded-md hover:bg-[#1d2360] transition duration-200"
            >
              Daftar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdmin;
