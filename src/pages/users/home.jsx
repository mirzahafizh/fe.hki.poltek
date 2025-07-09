import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Headbar from "../../components/HeadBar";
import NavbarUsers from "../../components/NavbarUsers";
import UserSubmissionCard from "../../components/users/cardDetailAjuan"; // ✅ Import
import Announcement from "../../components/users/pengumuman";

const HomeUsers = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <NavbarUsers />
      <Headbar />

      {/* ✅ Tambahkan di atas Pengumuman */}
      <div className="w-3/4 mx-auto mt-8">
        <UserSubmissionCard />
      </div>

      <div className="announcement w-3/4 bg-gray-200 mx-auto h-screen shadow-lg shadow-gray-400 rounded-lg mb-10">
        <div className="mt-10">
          <Announcement />
        </div>
      </div>
    </div>
  );
};

export default HomeUsers;
