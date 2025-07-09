import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgLogin from "../assets/BG-Home.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // 🔐 Cek apakah sudah login
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");

    if (token && expiry && new Date().getTime() < Number(expiry)) {
      navigate("/home"); // Jika masih valid, arahkan ke halaman utama
    }
  }, []);

const handleLogin = async (e) => {
  e.preventDefault();
  setErrorMsg("");

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    // Hapus tokenExpiry kalau sebelumnya pernah dipakai
    localStorage.removeItem("tokenExpiry");

    alert("Login Berhasil!");
    navigate("/home");
  } catch (error) {
    if (error.response?.data?.error) {
      setErrorMsg(error.response.data.error);
    } else {
      setErrorMsg("Terjadi kesalahan, coba lagi.");
    }
  }
};


  return (
    <div
  className="min-h-screen flex items-center justify-center"
  style={{ backgroundImage: `url(${bgLogin})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>


      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#272C7D] font-mono uppercase">
          Login SIKI
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#272C7D]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#272C7D]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <p className="text-red-600 text-sm mb-2">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#272C7D] text-white py-2 rounded-lg hover:bg-[#1e2370] transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-[#272C7D] font-medium hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
