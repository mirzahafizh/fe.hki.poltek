import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileLinkWithPreview from "../../dashboard/manajemenUsulan/FileLinkPreview";
const Step4 = ({ handleBack }) => {
  const [files, setFiles] = useState({
    suratPermohonanPembiayaanPaten: null,
    suratPengalihanHakKhusus2022: null,
    suratPernyataanKepemilikanInvensiOlehInventor: null,
    templateGambar: null,
    templateDeskripsi: null,
    suratPernyataanBelumKomersial: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0] || null,
    }));
  };

  const handleSubmitStep4 = async () => {
    setLoading(true);
    setMessage('');

    if (!window.confirm("Apakah Anda yakin ingin mengirim usulan Paten?")) {
      setLoading(false);
      return;
    }

    const submissionId = localStorage.getItem("submissionIdPaten");
    const token = localStorage.getItem("token");

    if (!submissionId || !token) {
      setMessage("Token atau Submission ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("submissionId", submissionId);
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/patents`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Berhasil mengirim usulan paten.");
      localStorage.removeItem("submissionDataIdPaten");
      localStorage.removeItem("submissionIdPaten");
      localStorage.removeItem("Paten");
      navigate("/paten/riwayat");
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

const handleDownloadPdf = (filename) => {
  const submissionId = localStorage.getItem("submissionIdPaten");
  if (!submissionId) {
    alert("Submission ID tidak ditemukan.");
    return;
  }

  const fileUrl = `${import.meta.env.VITE_API_URL_FILE}/storage/patents/${submissionId}/${filename}_${submissionId}.pdf`;

  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = `${filename}_${submissionId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const fileInputs = [
  {
    label: "Surat Permohonan Pembiayaan Paten",
    name: "suratPermohonanPembiayaanPaten",
    downloadable: true,
    filename: "surat_permohonan_paten",
  },
  {
    label: "Surat Pengalihan Hak Khusus 2022",
    name: "suratPengalihanHakKhusus2022",
    downloadable: true,
    filename: "surat_pengalihan_hak",
  },
  {
    label: "Surat Pernyataan Kepemilikan Invensi oleh Inventor",
    name: "suratPernyataanKepemilikanInvensiOlehInventor",
    downloadable: true,
    filename: "surat_pernyataan_kepemilikan_invensi",
  },
    {
    label: "Surat Pernyataan Paten Belum Komersial",
    name: "suratPernyataanBelumKomersial",
    downloadable: true,
    filename: "surat_paten_belum_komersial",
  },
  {
    label: "Template Gambar",
    name: "templateGambar",
    downloadable: false,
  },
  {
    label: "Template Deskripsi",
    name: "templateDeskripsi",
    downloadable: false,
  },

];


  return (
    <>
      {/* Template Info */}


      {/* File Inputs */}
{fileInputs.map(({ label, name, downloadable, filename }) => (
  <div key={name} className="mb-4">
    <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
      {label}
    </label>
    <input
      type="file"
      id={name}
      name={name}
      onChange={handleFileChange}
      accept="application/pdf"
      className="block w-full border border-gray-300 rounded-md px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <small className="block mt-1 text-sm text-gray-500">
      *Hanya menerima file PDF
    </small>

    {files[name] && (
      <small className="block mt-1 text-sm text-gray-600">
        File: {files[name].name}
      </small>
    )}

    {/* Tambahkan tombol download jika file tersedia dan bukan template */}
    {downloadable && (
      <div className="mt-2">
        <FileLinkWithPreview
          fileUrl={`${import.meta.env.VITE_API_URL_FILE}/storage/patents/${localStorage.getItem("submissionIdPaten")}/${filename}_${localStorage.getItem("submissionIdPaten")}.pdf`}
          label={`Download & Preview ${label}`}
        />
      </div>
    )}
  </div>
))}


<div className="flex justify-between items-center mt-6">
  <button
    type="button"
    onClick={handleBack}
    className="px-5 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
    disabled={loading}
  >
    Kembali
  </button>

  <button
    type="button"
    onClick={handleSubmitStep4}
    className="px-5 py-2 rounded-md bg-[#272C7D] text-white hover:bg-[#1e225e]"
    disabled={loading}
  >
    Kirim Usulan
  </button>
</div>


      {/* Loading */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-blue-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <p>Loading, mohon tunggu...</p>
          </div>
        </div>
      )}

      {/* Message */}
      {message && !loading && (
        <p className="mt-4 text-center text-red-600">{message}</p>
      )}
    </>
  );
};

export default Step4;
