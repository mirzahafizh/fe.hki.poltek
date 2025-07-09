import axios from "axios"; // import axios
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgLogin from "../assets/BG-Home.jpg";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();

  if (!username || !email || !gender || !phone || !password || !confirmPassword) {
    return alert("Semua kolom harus diisi!");
  }

  if (password !== confirmPassword) {
    return alert("Password dan konfirmasi password tidak sama!");
  }

  try {
    const response = await axios.post("http://localhost:3000/users/register", {
      username,
      email,
      password,
      nomorHp: phone,    // sesuaikan nama field dengan backend
      jenisKelamin: gender
    });

    if (response.status === 201 || response.status === 200) {
      alert("Pendaftaran berhasil!");
      navigate("/login");
    } else {
      alert("Gagal mendaftar, coba lagi.");
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      alert("Error: " + error.response.data.error);
    } else {
      alert("Terjadi kesalahan jaringan atau server.");
    }
  }

};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]" style={{ backgroundImage: `url(${bgLogin})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#272C7D] font-mono uppercase">
          Register SIKI
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">

          <div>
            <label className="block text-gray-700 text-sm mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Jenis Kelamin</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">-- Pilih --</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Nomor HP</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Konfirmasi Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#272C7D] text-white py-2 rounded-lg hover:bg-[#1e2370] transition duration-300"
          >
            Daftar
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-[#272C7D] font-medium hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
