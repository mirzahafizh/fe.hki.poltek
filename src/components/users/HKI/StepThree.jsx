import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileLinkWithPreview from "../../dashboard/manajemenUsulan/FileLinkPreview";

const Step3 = ({ handleBack }) => {
  const [files, setFiles] = useState({
    scanKTPPemohon: null,
    surat_pernyataan_submission: null,
    surat_pernyataan_poltekba: null,
    surat_pengalihan_hak_cipta: null,
    contohCiptaan: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API_FILE_URL = import.meta.env.VITE_API_URL_FILE;
  const submissionId = localStorage.getItem("submissionIdHKI");

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0] || null,
    }));
  };

  // Mapping dari nama field input ke nama field API
  const fileFieldMap = {
    scanKTPPemohon: "scanKTPPemohon",
    surat_pernyataan_submission: "suratPernyataanPemohon",
    surat_pernyataan_poltekba: "suratPernyataanPoltekba",
    surat_pengalihan_hak_cipta: "suratPengalihanPoltekTtdDirektur",
    contohCiptaan: "contohCiptaan",
  };

  const fileInputs = [
    { label: "Scan KTP Pemohon", name: "scanKTPPemohon" },
    { label: "Surat Pernyataan Pemohon", name: "surat_pernyataan_submission" },
    { label: "Surat Pernyataan Poltekba", name: "surat_pernyataan_poltekba" },
    { label: "Surat Pengalihan Poltek (TTD Direktur)", name: "surat_pengalihan_hak_cipta" },
    { label: "Contoh Ciptaan", name: "contohCiptaan" },
  ];

  const handleSubmitStep3 = async () => {
    setLoading(true);
    setMessage("");

    if (!window.confirm("Apakah Anda yakin ingin mengirim usulan hak cipta?")) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!submissionId) {
      setMessage("Submission ID tidak ditemukan.");
      setLoading(false);
      return;
    }
    if (!token) {
      setMessage("Token tidak ditemukan. Silakan login ulang.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("submissionId", submissionId);

    Object.entries(files).forEach(([previewKey, file]) => {
      if (file && fileFieldMap[previewKey]) {
        formData.append(fileFieldMap[previewKey], file);
      }
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/copyrights`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Berhasil mengirim usulan.");
      alert("Berhasil mengirim usulan hak cipta.");
      localStorage.removeItem("submissionDataIdHKI");
      localStorage.removeItem("submissionIdHKI");
      localStorage.removeItem("HKI");

      navigate("/hakcipta/riwayat");
    } catch (error) {
      console.error(error);
      setMessage("Gagal mengirim data.");
      alert("Gagal mengirim data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const getFilePreviewLink = (name) =>
    `${API_FILE_URL}/storage/copyrights/${submissionId}/${name}_${submissionId}.pdf`;

  return (
    <div className="relative">
 

      {fileInputs.map(({ label, name }) => (
        <div key={name} className="mb-4">
          <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
            {label}
          </label>
          <input
            type="file"
            id={name}
            name={name}
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Tampilkan preview jika tidak ada file baru */}
          {!files[name] && submissionId &&
            ["surat_pernyataan_submission", "surat_pernyataan_poltekba", "surat_pengalihan_hak_cipta"].includes(name) && (
              <FileLinkWithPreview
                label="Lihat file saat ini"
                fileUrl={getFilePreviewLink(name)}
              />
          )}

          {/* Tampilkan nama file jika dipilih */}
          {files[name] && (
            <small className="block mt-1 text-sm text-gray-600">
              File dipilih: <strong>{files[name].name}</strong>
            </small>
          )}
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handleBack}
          className="px-5 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Kembali
        </button>
        <button
          type="button"
          onClick={handleSubmitStep3}
          className="px-5 py-2 rounded-md bg-[#272C7D] text-white hover:bg-[#1e225e]"
        >
          Kirim Usulan
        </button>
      </div>

      {/* Loading popup */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="loader mb-4 border-4 border-blue-300 border-t-blue-700 rounded-full w-12 h-12 animate-spin mx-auto" />
            <p className="text-lg font-semibold">Mengirim usulan...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3;
