import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo-poltekba.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isPengumumanDropdownOpen, setIsPengumumanDropdownOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const navigate = useNavigate();
const [isGelombangDropdownOpen, setIsGelombangDropdownOpen] = useState(false);

  const filters = ["disubmit","revisi", "submit"];
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const handleFilterClick = (filter) => {
    setFilterStatus(filter);
    navigate(`/manajemen-ajuan?status=${filter}`);
  };
  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  // Jalankan saat komponen pertama kali di-mount
  handleResize();

  // Tambahkan event listener saat resize
  window.addEventListener("resize", handleResize);

  // Cleanup saat komponen di-unmount
  return () => window.removeEventListener("resize", handleResize);
}, []);


  return (
    <div className="flex font-mono ">
      <div
        className={`
          relative
          ${isOpen ? "w-64" : "w-16"}
          bg-[#272C7D] min-h-screen p-4 transition-all duration-300
          flex flex-col
        `}
      >
        {/* Toggle button di kanan atas */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 right-4 text-white focus:outline-none z-50"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="flex justify-center items-center mb-4 mt-10">
          {isOpen && (
            <button
              onClick={() => navigate("/admin/dashboard/home")}
              className="focus:outline-none"
            >
              <img src={Logo} alt="Logo" className="h-12 object-contain cursor-pointer" />
            </button>
          )}
        </div>

        {/* Menu */}
<ul className="space-y-2 mt-6 text-white flex-1 divide-y divide-white">
  {/* Manajemen Ajuan */}
  <li className="pb-2">
    <button
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      className="w-full flex justify-between items-center font-extrabold text-white rounded p-2 hover:bg-gray-400 transition"
    >
      {isOpen ? "Manajemen Ajuan" : "📁"}
      {isOpen && (isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
    </button>
    {isDropdownOpen && isOpen && (
      <ul className="mt-2 ml-4 space-y-1 text-white font-semibold rounded p-2">
        {filters.map((filter) => (
          <li key={filter}>
            <button
              onClick={() => handleFilterClick(filter)}
              className="block w-full text-left hover:bg-gray-300 rounded p-1"
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    )}
  </li>

  {/* User */}
  <li className="pt-2 pb-2">
    <button
      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
      className="w-full flex justify-between items-center font-extrabold text-white rounded p-2 hover:bg-gray-400 transition"
    >
      {isOpen ? "User" : "👥"}
      {isOpen && (isUserDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
    </button>
    {isUserDropdownOpen && isOpen && (
      <ul className="mt-2 ml-4 space-y-1 text-white font-semibold rounded p-2">
        <li>
          <button
            onClick={() => navigate("/register-admin")}
            className="block w-full text-left hover:bg-gray-300 rounded p-1"
          >
            Register Admin
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/manajemen-user")}
            className="block w-full text-left hover:bg-gray-300 rounded p-1"
          >
            Manajemen User
          </button>
        </li>
      </ul>
    )}
  </li>

  {/* Pengumuman */}
  <li className="pt-2 pb-2">
    <button
      onClick={() => setIsPengumumanDropdownOpen(!isPengumumanDropdownOpen)}
      className="w-full flex justify-between items-center font-extrabold text-white rounded p-2 hover:bg-gray-400 transition"
    >
      {isOpen ? "Pengumuman" : "📢"}
      {isOpen && (isPengumumanDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
    </button>
    {isPengumumanDropdownOpen && isOpen && (
      <ul className="mt-2 ml-4 space-y-1 text-white font-semibold rounded p-2">
        <li>
          <button
            onClick={() => navigate("/buat-pengumuman")}
            className="block w-full text-left hover:bg-gray-300 rounded p-1"
          >
            Buat Pengumuman
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/manajemen-pengumuman")}
            className="block w-full text-left hover:bg-gray-300 rounded p-1"
          >
            Manajemen Pengumuman
          </button>
        </li>
      </ul>
    )}
  </li>
{/* Gelombang Pengajuan (Dropdown khusus Superadmin) */}
{role === "superadmin" && (
  <li className="pt-2 pb-2">
    <button
      onClick={() => setIsGelombangDropdownOpen(!isGelombangDropdownOpen)}
      className="w-full flex justify-between items-center font-extrabold text-white rounded p-2 hover:bg-gray-400 transition"
    >
      {isOpen ? "Gelombang Pengajuan" : "📆"}
      {isOpen && (isGelombangDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
    </button>
    {isGelombangDropdownOpen && isOpen && (
      <ul className="mt-2 ml-4 space-y-1 text-white font-semibold rounded p-2">
        <li>
          <button
            onClick={() => navigate("/gelombang-pengajuan")}
            className="block w-full text-left hover:bg-gray-300 rounded p-1"
          >
            Buat Gelombang
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/daftar-gelombang")}
            className="block w-full text-left hover:bg-gray-300 rounded p-1"
          >
            Daftar Gelombang
          </button>
        </li>
      </ul>
    )}
  </li>
)}
  {/* Input Kode Billing */}
 {role === "superadmin" && (
      <li
        className="pt-2"
        onClick={() => navigate("/input-kode-billing")}
      >
        <div className="p-2 rounded cursor-pointer hover:bg-gray-400 transition text-md font-extrabold text-left text-white">
          {isOpen ? "Input Kode Billing" : "💳"}
        </div>
      </li>
      
    )}



</ul>

      </div>
    </div>
  );
};

export default Sidebar;
