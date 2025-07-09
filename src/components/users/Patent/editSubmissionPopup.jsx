import axios from "axios";
import { useEffect, useState } from "react";

const EditSubmissionPopup = ({ isOpen, onClose, submissionId, onSuccess }) => {
  const [formData, setFormData] = useState({
    jenisCiptaan: "",
    subJenisCiptaan: "",
    uraianSingkat: "",
    tanggalPublish: "",
    tempatPublish: "",
    dataKuasa: "",
    namaKuasa: "",
    alamatKuasa: "",
    emailKuasa: "",
    statusSubmission: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen && submissionId) {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      axios
        .get(`${API_URL}/submissions/${submissionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const data = response.data;
          setFormData({
            jenisCiptaan: data.jenisCiptaan || "",
            subJenisCiptaan: data.subJenisCiptaan || "",
            judulCiptaan: data.judulCiptaan || "",
            uraianSingkat: data.uraianSingkat || "",
            tanggalPublish: data.tanggalPublish ? data.tanggalPublish.slice(0, 10) : "",
            tempatPublish: data.tempatPublish || "",
            dataKuasa: data.dataKuasa || "",
            namaKuasa: data.namaKuasa || "",
            alamatKuasa: data.alamatKuasa || "",
            emailKuasa: data.emailKuasa || "",
            statusSubmission: data.statusSubmission || "",
          });
          setData(data);
        })
        .catch((err) => {
          setError("Gagal memuat data untuk diedit");
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, submissionId, API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token tidak ditemukan, silakan login ulang");
        setLoading(false);
        return;
      }

      await axios.put(`${API_URL}/submission/${data.submissionDataId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Berhasil menyimpan perubahan");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Gagal menyimpan perubahan";
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Loader saat loading PUT */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="loader mb-4 border-4 border-blue-300 border-t-blue-700 rounded-full w-12 h-12 animate-spin mx-auto" />
            <p className="text-lg font-semibold">Mengirim usulan...</p>
          </div>
        </div>
      )}

      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-40">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl max-h-[90vh] overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Edit Submission</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {error && <p className="text-red-600 mb-3">{error}</p>}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {[
                  ["jenisCiptaan", "Jenis Ciptaan"],
                  ["subJenisCiptaan", "Sub Jenis Ciptaan"],
                  ["judulCiptaan", "Judul Ciptaan"],
                  ["uraianSingkat", "Uraian Singkat", "textarea"],
                  ["tanggalPublish", "Tanggal Publish", "date"],
                  ["tempatPublish", "Tempat Publish"],
                  ["dataKuasa", "Data Kuasa"],
                  ["namaKuasa", "Nama Kuasa"],
                  ["alamatKuasa", "Alamat Kuasa"],
                  ["emailKuasa", "Email Kuasa", "email"],
                ].map(([name, label, type = "text"]) => (
                  <label key={name} className="flex flex-col">
                    {label}
                    {type === "textarea" ? (
                      <textarea
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        rows={3}
                        required
                        className="border p-2 rounded"
                      />
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        required={name !== "dataKuasa" && name !== "namaKuasa" && name !== "alamatKuasa" && name !== "emailKuasa"}
                        className="border p-2 rounded"
                      />
                    )}
                  </label>
                ))}

                <button
                  type="submit"
                  className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
                  disabled={loading}
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-4 py-2 border rounded hover:bg-gray-100 transition"
                >
                  Batal
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EditSubmissionPopup;
