import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Ambil user dari localStorage saat komponen mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    } else {
      handleLogout(); // Redirect jika tidak ada data user atau token
    }
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Hapus semua item dari localStorage
    navigate("/login");
  };

  // Tampilkan loading jika data user belum dimuat
  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white px-6 py-4 rounded shadow-md text-center">
          <p className="text-gray-800 font-medium">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <nav className="bg-[#272C7D] flex justify-end items-center p-4 shadow-lg text-white">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-3 cursor-pointer focus:outline-none"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          <img
            src={user.image || `https://i.pravatar.cc/40?u=${user.email}`}
            alt="User Profile"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span>{user.username}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg z-50">
            <button
              onClick={() => navigate("/profile-dashboard")}
              className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
            >
              Profil Saya
            </button>
            <button
              onClick={() => navigate("/home")}
              className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
            >
              Halaman User
            </button>
            <hr />
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 hover:bg-red-100 text-left text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
