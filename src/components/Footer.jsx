import LogoPoltek from "../assets/logo-poltekba.png"; // Ganti dengan path logo kamu

const Footer = () => {
  return (
    <footer className="bg-[#272C7D] text-white py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Kolom 1 - Logo */}
        <div>
          <img src={LogoPoltek} alt="Logo Poltekba" className="h-12 mb-4" />

        </div>

        {/* Kolom 2 - Navigasi */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Navigasi</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline">Beranda</a></li>
            <li><a href="/pengumuman" className="hover:underline">Pengumuman</a></li>
            <li><a href="/login" className="hover:underline">Login</a></li>
          </ul>
        </div>

        {/* Kolom 3 - Kontak */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Kontak</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: hki@poltekba.ac.id</li>
            <li>Telepon: (0542) 123456</li>
            <li>WhatsApp: -</li>
          </ul>
        </div>

        {/* Kolom 4 - Alamat */}
      </div>

      {/* Garis dan copyright */}
      <div className="border-t border-white mt-10 pt-4 text-center text-sm text-gray-300">
        &copy; {new Date().getFullYear()} Politeknik Negeri Balikpapan - Hak Cipta Dilindungi
      </div>
    </footer>
  );
};

export default Footer;
