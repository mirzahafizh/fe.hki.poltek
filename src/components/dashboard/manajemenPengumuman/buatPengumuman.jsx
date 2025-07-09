import axios from "axios";
import { useState } from "react";

const CreateAnnouncementForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
  });
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    const token = localStorage.getItem("token");

    if (!userId) {
      setError("User belum login.");
      setLoading(false);
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append("userId", userId);
      formPayload.append("judul", formData.judul);
      formPayload.append("deskripsi", formData.deskripsi);
      if (file) formPayload.append("file", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/announcements`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData({ judul: "", deskripsi: "" });
      setFile(null);
      setSuccess(true);
      if (onSuccess) onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Popup Loading */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md flex items-center space-x-3">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span>Menyimpan pengumuman...</span>
          </div>
        </div>
      )}

      {/* Popup Success */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md text-center max-w-xs mx-auto">
            <h3 className="text-green-600 font-bold text-lg mb-4">
              Pengumuman berhasil dikirim!
            </h3>
            <button
              onClick={() => setSuccess(false)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md max-w-md w-full mx-auto"
        encType="multipart/form-data"
      >
        <h2 className="text-lg font-bold mb-4">Buat Pengumuman</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="mb-4">
          <label htmlFor="judul" className="block font-medium mb-1">
            Judul
          </label>
          <input
            type="text"
            name="judul"
            id="judul"
            value={formData.judul}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="deskripsi" className="block font-medium mb-1">
            Deskripsi
          </label>
          <textarea
            name="deskripsi"
            id="deskripsi"
            rows="4"
            value={formData.deskripsi}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4 ">
          <label htmlFor="file" className="block font-medium mb-1 ">
            File (Opsional)
          </label>
          <input
            type="file"
            name="file"
            id="file"
            onChange={handleFileChange}
            className="w-full border border-black"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Kirim Pengumuman
        </button>
      </form>
    </>
  );
};

export default CreateAnnouncementForm;
