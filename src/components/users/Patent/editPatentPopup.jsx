import axios from "axios";
import { useEffect, useState } from "react";
import FileLinkWithPreview from "../../dashboard/manajemenUsulan/FileLinkPreview";

const EditPatentPopup = ({ isOpen, onClose, id, onSuccess }) => {
  const [patentData, setPatentData] = useState({
    suratPermohonanPembiayaanPaten: "",
    suratPengalihanHakKhusus2022: "",
    suratPernyataanKepemilikanInvensiOlehInventor: "",
    templateGambar: "",
    templateDeskripsi: "",
    suratPernyataanBelumKomersial: "",
  });

  const [files, setFiles] = useState({
    suratPermohonanPembiayaanPaten: null,
    suratPengalihanHakKhusus2022: null,
    suratPernyataanKepemilikanInvensiOlehInventor: null,
    templateGambar: null,
    templateDeskripsi: null,
    suratPernyataanBelumKomersial: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const API_FILE_URL = import.meta.env.VITE_API_URL_FILE;

  useEffect(() => {
    if (isOpen && id) {
      const url = `${API_URL}/patents/${id}`;
      const token = localStorage.getItem("token");

      setLoading(true);
      setError(null);

      axios
        .get(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setPatentData({
            suratPermohonanPembiayaanPaten: res.data.suratPermohonanPembiayaanPaten || "",
            suratPengalihanHakKhusus2022: res.data.suratPengalihanHakKhusus2022 || "",
            suratPernyataanKepemilikanInvensiOlehInventor: res.data.suratPernyataanKepemilikanInvensiOlehInventor || "",
            templateGambar: res.data.templateGambar || "",
            templateDeskripsi: res.data.templateDeskripsi || "",
            suratPernyataanBelumKomersial: res.data.suratPernyataanBelumKomersial || "",
          });

          setFiles({
            suratPermohonanPembiayaanPaten: null,
            suratPengalihanHakKhusus2022: null,
            suratPernyataanKepemilikanInvensiOlehInventor: null,
            templateGambar: null,
            templateDeskripsi: null,
            suratPernyataanBelumKomersial: null,
          });
        })
        .catch((err) => {
          console.error(err);
          setError("Gagal memuat data paten. Silakan coba lagi nanti.");
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, id, API_URL]);

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [fieldName]: file || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  Object.entries(files).forEach(([key, file]) => {
    if (file) formData.append(key, file);
  });

  await axios.put(`${API_URL}/patents/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  alert("Berhasil menyimpan data Paten."); // ✅ alert sukses
  onSuccess();
  onClose();

} catch (err) {
  console.error(err);

  const message =
    err.response?.data?.message || "Gagal menyimpan data paten. Silakan coba lagi.";

  setError(message);
  alert(message); // ❌ alert gagal

} finally {
  setLoading(false);
}

  };

  if (!isOpen) return null;

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="loader mb-4 border-4 border-blue-300 border-t-blue-700 rounded-full w-12 h-12 animate-spin mx-auto" />
            <p className="text-lg font-semibold">Upadte Usulan...</p>
          </div>
        </div>
      )}

      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-40">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl max-h-[90vh] overflow-auto relative">
          <h2 className="text-xl font-semibold mb-4">Edit Paten</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { label: "Surat Permohonan Pembiayaan Paten", name: "suratPermohonanPembiayaanPaten" },
              { label: "Surat Pengalihan Hak Khusus 2022", name: "suratPengalihanHakKhusus2022" },
              { label: "Surat Pernyataan Kepemilikan Invensi oleh Inventor", name: "suratPernyataanKepemilikanInvensiOlehInventor" },
              { label: "Template Gambar", name: "templateGambar" },
              { label: "Template Deskripsi", name: "templateDeskripsi" },
              { label: "Surat Pernyataan Belum Komersial", name: "suratPernyataanBelumKomersial" },
            ].map(({ label, name }) => (
              <div key={name} className="flex flex-col gap-1 text-sm text-gray-700 mb-4">
  <label className="font-medium">{label}</label>
  
  <input
    type="file"
    accept="application/pdf,image/*"
    onChange={(e) => handleFileChange(e, name)}
    className="border p-2 rounded"
  />

  {/* Preview file lama */}
  {!files[name] && patentData[name] && (
<div className="mt-1 text-left">
      <FileLinkWithPreview
        label="Lihat file saat ini"
        fileUrl={`${API_FILE_URL}/storage/${patentData[name]}`}
      />
    </div>
  )}

  {/* Preview file baru */}
  {files[name] && (
    <span className="text-gray-600 text-xs">
      File dipilih: <strong>{files[name].name}</strong>
    </span>
  )}
</div>

            ))}

            <button
              type="submit"
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
              disabled={loading}
            >
              Simpan Paten
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-4 py-2 border rounded hover:bg-gray-100 transition"
            >
              Batal
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPatentPopup;
