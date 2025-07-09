import { useState } from "react";

const UploadBuktiPopup = ({ isOpen, onClose, paymentId, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Silakan pilih file terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Ambil user dari localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        setError("User tidak terautentikasi.");
        setLoading(false);
        return;
      }

      // Buat form data untuk upload file
      const formData = new FormData();
      formData.append("buktiPembayaran", file);

      const apiUrl = `${import.meta.env.VITE_API_URL}/payments/${paymentId}/upload`;
        const token = localStorage.getItem("token"); // Atau dari state/context

        const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`, // Ganti `token` dengan variabel token kamu
        },
        body: formData,
        });


      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mengunggah bukti pembayaran.");
      }

      // Kalau sukses
      alert("Bukti pembayaran berhasil diupload!");
      setLoading(false);
      onSuccess && onSuccess(); // Bisa refresh data atau close popup
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Upload Bukti Pembayaran</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="mb-4"
          />
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Mengunggah..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadBuktiPopup;
