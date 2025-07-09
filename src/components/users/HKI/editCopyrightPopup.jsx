import axios from "axios";
import { useEffect, useState } from "react";
import FileLinkWithPreview from "../../dashboard/manajemenUsulan/FileLinkPreview"; // Pastikan path ini benar

const EditCopyrightPopup = ({ isOpen, onClose, id, onSuccess }) => {
  const [copyrightData, setCopyrightData] = useState({
    scanKTPPemohon: "",
    suratPernyataanPemohon: "",
    suratPernyataanPoltekba: "",
    contohCiptaan: "",
    suratPengalihanPoltekTtdDirektur: "",
  });

  const [files, setFiles] = useState({
    scanKTPPemohon: null,
    suratPernyataanPemohon: null,
    suratPernyataanPoltekba: null,
    contohCiptaan: null,
    suratPengalihanPoltekTtdDirektur: null,
  });

  const [loadingData, setLoadingData] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const fileBaseUrl = import.meta.env.VITE_API_URL_FILE;

  useEffect(() => {
    if (isOpen && id) {
      const url = `${API_URL}/copyrights/${id}`;
      setLoadingData(true);
      setError(null);
      const token = localStorage.getItem("token");

      axios
        .get(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setCopyrightData({
            scanKTPPemohon: res.data.scanKTPPemohon || "",
            suratPernyataanPemohon: res.data.suratPernyataanPemohon || "",
            suratPernyataanPoltekba: res.data.suratPernyataanPoltekba || "",
            contohCiptaan: res.data.contohCiptaan || "",
            suratPengalihanPoltekTtdDirektur:
              res.data.suratPengalihanPoltekTtdDirektur || "",
          });

          // Reset file input
          setFiles({
            scanKTPPemohon: null,
            suratPernyataanPemohon: null,
            suratPernyataanPoltekba: null,
            contohCiptaan: null,
            suratPengalihanPoltekTtdDirektur: null,
          });
        })
        .catch((err) => {
          setError("Gagal memuat data copyrights. Silakan coba lagi.");
          console.error(err);
        })
        .finally(() => setLoadingData(false));
    }
  }, [isOpen, id, API_URL]);

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [fieldName]: file || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

Object.entries(files).forEach(([key, file]) => {
  if (file) {
    console.log("Mengirim file:", key, file.name);
    formData.append(key, file);
  }
});


      await axios.post(`${API_URL}/copyrights/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Berhasil menyimpan data copyrights.");
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Gagal menyimpan data copyrights. Silakan coba lagi.";
      setError(msg);
      console.error(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {(loadingData || loadingSubmit) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="loader mb-4 border-4 border-blue-300 border-t-blue-700 rounded-full w-12 h-12 animate-spin mx-auto" />
            <p className="text-lg font-semibold">
              {loadingSubmit ? "Menyimpan data..." : "Memuat data..."}
            </p>
          </div>
        </div>
      )}

      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-40">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl max-h-[90vh] overflow-auto relative">
          <h2 className="text-xl font-semibold mb-4">Edit Copyrights</h2>

          {error && <p className="text-red-600 mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { label: "Scan KTP Pemohon", name: "scanKTPPemohon" },
              { label: "Surat Pernyataan Pemohon", name: "suratPernyataanPemohon" },
              { label: "Surat Pernyataan Poltekba", name: "suratPernyataanPoltekba" },
              { label: "Contoh Ciptaan", name: "contohCiptaan" },
              {
                label: "Surat Pengalihan Poltek Ttd Direktur",
                name: "suratPengalihanPoltekTtdDirektur",
              },
            ].map(({ label, name }) => {
              const val = copyrightData[name];
              const lowerVal = val?.toString().toLowerCase() || "";
              const isFile =
                lowerVal.endsWith(".pdf") ||
                lowerVal.endsWith(".jpg") ||
                lowerVal.endsWith(".jpeg") ||
                lowerVal.endsWith(".png");

              const previewUrl = lowerVal.startsWith("http")
                ? val
                : `${fileBaseUrl}/storage/${val}`;

              return (
                <div key={name} className="flex flex-col">
  <label className="mb-1">{label}</label>
  <input
    type="file"
    accept="application/pdf,image/*"
    onChange={(e) => handleFileChange(e, name)}
    className="border p-2 rounded"
    disabled={loadingSubmit || loadingData}
  />

  {/* Preview file lama jika belum upload baru */}
  {!files[name] && val && isFile && (
    <div className="mt-1">
      <FileLinkWithPreview fileUrl={previewUrl} label="Lihat file saat ini" />
    </div>
  )}

  {/* Tampilkan nama file yang akan diupload */}
  {files[name] && (
    <span className="mt-1 text-sm">{files[name].name}</span>
  )}
</div>

              );
            })}

            <button
              type="submit"
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition disabled:opacity-50"
              disabled={loadingSubmit || loadingData}
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-4 py-2 border rounded hover:bg-gray-100 transition"
              disabled={loadingSubmit || loadingData}
            >
              Batal
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCopyrightPopup;
