import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoPoltek from "../assets/logo-poltekba.png";

const NavbarUsers = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      navigate("/login");
    } else {
      try {
        const parsed = JSON.parse(user);
        setUserData(parsed);
      } catch (error) {
        console.error("Gagal parsing data user:", error);
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout gagal:", error);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  if (!userData) return null;

  return (
    <nav className="bg-[#272C7D] flex justify-between items-center p-4 shadow-md border-b border-gray-300">
      <div className="flex items-center">
        <img src={LogoPoltek} alt="Logo" className="h-10" />
      </div>

      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <img
            src={userData.image}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span className="text-white font-medium">{userData.username}</span>
          <svg
            className="w-4 h-4 text-white"
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
          <div className="absolute right-0 top-14 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <button
              onClick={() => navigate("/profile")}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Lihat Profil
            </button>

            {userData.role === "superadmin" && (
              <>
                <hr className="border-t border-gray-200 my-1" />
                <button
                  onClick={() => navigate("/admin/dashboard/home")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Dashboard Admin
                </button>
              </>
            )}

            <hr className="border-t border-gray-200 my-1" />
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarUsers;
