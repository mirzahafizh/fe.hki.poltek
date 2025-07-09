import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Import halaman
import Step3 from "./components/users/Patent/StepThree";
import CreateBatchPage from "./pages/dashboard/buatGelombangPengajuan";
import AnnouncementPage from "./pages/dashboard/buatPengumuman";
import Dashboard from "./pages/dashboard/HomeDashboard";
import BillingInputPage from "./pages/dashboard/inputKodeBillingPage";
import ManajemenGelombangPengajuanPage from "./pages/dashboard/manajemenGelombangPengajuan";
import ManajemenPengumumanPage from "./pages/dashboard/manajemenPengumuman";
import ManageUsers from "./pages/dashboard/manajemenUsers";
import ManajemenAjuan from "./pages/dashboard/manajemenUsulan";
import ProfileDashboard from "./pages/dashboard/profile";
import RegisterAdmin from "./pages/dashboard/RegisterAdmin";
import Home from "./pages/home";
import Login from "./pages/Login";
import PengumumanPage from "./pages/Pengumuman";
import Register from "./pages/Register";
import HomeUsers from "./pages/users/home";
import Profile from "./pages/users/profile";
import RiwayatHKIPages from "./pages/users/riwayatHKI";
import Riwayat from "./pages/users/riwayatPatent";
import NewHki from "./pages/users/UsulanBaruHKI";
import NewPatent from "./pages/users/UsulanBaruPaten";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pengumuman" element={<PengumumanPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomeUsers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/hakcipta/usulan" element={<NewHki />} />
        <Route path="/hakcipta/riwayat" element={<RiwayatHKIPages />} />
        <Route path="/paten/usulan" element={<NewPatent />} />
        <Route path="/paten/riwayat" element={<Riwayat />} />
        <Route path="admin/dashboard/home" element={<Dashboard />} />
        <Route path="/upload" element={<Step3 />} />
        <Route path="/manajemen-ajuan" element={<ManajemenAjuan />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/manajemen-user" element={<ManageUsers />} />
        <Route path="/buat-pengumuman" element={<AnnouncementPage />} />
        <Route path="/manajemen-pengumuman" element={<ManajemenPengumumanPage />} />
        <Route path="/input-kode-billing" element={<BillingInputPage />} />
        <Route path="/profile-dashboard" element={<ProfileDashboard />} />
        <Route path="/gelombang-pengajuan" element={<CreateBatchPage />} />
        <Route path="/daftar-gelombang" element={<ManajemenGelombangPengajuanPage />} />
      </Routes>
    </Router>
  );
};

export default App;
