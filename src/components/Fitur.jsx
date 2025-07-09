import { FaBolt, FaCheckCircle, FaCogs, FaMobileAlt } from "react-icons/fa";
import LogoPoltek from "../assets/logo-1__1_-removebg-preview.png";

const Fitur = () => {
  return (
    <div className="container-pengumuman mt-0 mx-auto w-11/12 sm:w-4/5 p-6 mb-10">
      <h1 className="text-center text-2xl font-semibold uppercase font-mono">FITUR</h1>
      <div className="w-[90px] h-2 bg-[#DA2329] rounded-xl mx-auto mt-2"></div>
      <h2 className="text-center mt-4 text-sm text-gray-700">
        Fitur-fitur yang tersedia pada Sistem Informasi Kekayaan Intelektual Politeknik Negeri Balikpapan
      </h2>

      {/* Grid 3 kolom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 text-center items-center">
        {/* Kolom kiri - fitur 1 dan 3 */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center  p-4">
            <FaCheckCircle className="text-4xl text-[#272C7D] mb-3" />
            <h3 className="text-lg font-semibold text-[#272C7D] mb-1">Berfungsi Penuh</h3>
            <p className="text-sm text-gray-700">
              Mendukung penuh untuk membuat usulan Kekayaan Intelektual.
            </p>
          </div>

          <div className="flex flex-col items-center  p-4">
            <FaCogs className="text-4xl text-[#272C7D] mb-3" />
            <h3 className="text-lg font-semibold text-[#272C7D] mb-1">Konfigurable</h3>
            <p className="text-sm text-gray-700">
              Mudah untuk mengatur usulan penelitian dan pengabdian.
            </p>
          </div>
        </div>

        {/* Kolom tengah - logo */}
        <div className="flex justify-center">
          <img
            src={LogoPoltek}
            alt="Logo Poltekba"
            className="h-[200px] w-[200px] object-contain"
          />
        </div>

        {/* Kolom kanan - fitur 2 dan 4 */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center  p-4">
            <FaBolt className="text-4xl text-[#272C7D] mb-3" />
            <h3 className="text-lg font-semibold text-[#272C7D] mb-1">Cepat & Mudah</h3>
            <p className="text-sm text-gray-700">
              Proses cepat dan mudah digunakan.
            </p>
          </div>

          <div className="flex flex-col items-center  p-4">
            <FaMobileAlt className="text-4xl text-[#272C7D] mb-3" />
            <h3 className="text-lg font-semibold text-[#272C7D] mb-1">Desain Responsif</h3>
            <p className="text-sm text-gray-700">
              Desain yang responsif dan mudah digunakan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fitur;
