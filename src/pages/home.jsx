import Fitur from "../components/Fitur";
import Footer from "../components/Footer";
import CustomNavbar from "../components/Navbar";
import Pengumuman from "../components/Pengumuman";

const Home = () => {
  return (
    <>
      <CustomNavbar />
      <div className="h-screen font-mono">
      <div className="relative  overflow-hidden flex items-center justify-center transition-all duration-500 sm:h-[300px] h-[300px]">
        <svg
          viewBox="0 0 1920 560"
          preserveAspectRatio="none"
          className="absolute top-0 left-1/2 -translate-x-1/2 h-full 
                    w-[1920px] sm:w-[760px] md:w-full xs-w-[640px]  lg:w-full 
                    transition-all duration-500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 C0,0 192,560 384,560 C768,560 1152,440 1536,384 C1728,352 1920,320 1920,320 L1920,0 Z"
            fill="#272B7A"
          />
        </svg>

        <div className="relative z-10 w-11/12 sm:w-1/2 text-center font-mono text-2xl font-extrabold text-white">
          <h1>Selamat Datang di Sistem Informasi HKI Politeknik Negeri Balikpapan</h1>
          <h2 className="text-[16px] font-medium mt-4">
            Politeknik Negeri Balikpapan Siap Menangani Kekayaan Intelektual Anda
          </h2>
        </div>
      </div>



        <Pengumuman />
        <Fitur />
        <Footer />
      </div>
    </>
  );
};

export default Home;
