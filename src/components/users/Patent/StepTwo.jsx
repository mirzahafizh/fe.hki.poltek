import axios from "axios";
import { useEffect, useState } from "react";

const Step2 = ({ formData, handleChange, handleBack, handleNext }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mandiri");
  const [submissionDataId, setSubmissionDataId] = useState("");
  useEffect(() => {
    const storedSubmissionDataId = localStorage.getItem("submissionDataIdPaten");
    const storedSubmissionId = localStorage.getItem("submissionIdPaten");
    
    if (storedSubmissionDataId) {
      setSubmissionDataId(storedSubmissionDataId);
    } else {
      setError("submissionDataId tidak ditemukan di localStorage.");
    }

    if (storedSubmissionId) {
      setSubmissionId(storedSubmissionId);
    } else {
      setError("submissionId tidak ditemukan di localStorage.");
    }
  }, []);

  const handleSubmitStep2 = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token tidak ditemukan. Silakan login ulang.");
      setLoading(false);
      return;
    }
if (
    !formData.jenisCiptaan ||
    !formData.subJenisCiptaan.trim() ||
    !formData.judulCiptaan.trim() ||
    !formData.uraianSingkat.trim() ||
    !formData.tanggalPublish ||
    !formData.tempatPublish.trim() ||
    !formData.menggunakanKuasa // harus pilih Ya/Tidak
  ) {
    setError("Semua field wajib diisi.");
    return;
  }

  if (formData.menggunakanKuasa === "Ya") {
    if (
      !formData.namaKuasa.trim() ||
      !formData.alamatKuasa.trim() ||
      !formData.emailKuasa.trim()
    ) {
      setError("Data Kuasa harus diisi lengkap.");
      return;
    }
  }

  if (!paymentMethod) {
    setError("Metode pembayaran harus dipilih.");
    return;
  }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      // Update submission data
      await axios.put(
       `${import.meta.env.VITE_API_URL}/submissions/by-submission-data/${submissionDataId}`,

        {
          jenisCiptaan: formData.jenisCiptaan,
          subJenisCiptaan: formData.subJenisCiptaan,
          judulCiptaan: formData.judulCiptaan,
          uraianSingkat: formData.uraianSingkat,
          tanggalPublish: formData.tanggalPublish,
          tempatPublish: formData.tempatPublish,
          dataKuasa: formData.menggunakanKuasa === "Ya" ? "Ya" : "Tidak",
          namaKuasa: formData.namaKuasa || "",
          alamatKuasa: formData.alamatKuasa || "",
          emailKuasa: formData.emailKuasa || "",
        },
        { headers }
      );

      // Kirim metode pembayaran ke API
      const dataToSend = {
        submissionId,
        jenisPembayaran: paymentMethod,
        statusPembayaran: "menunggu kode billing",
        buktiPembayaran: "",
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/payments`,
        dataToSend,
        { headers }
      );

      handleNext();
    } catch (err) {
      console.error("Error saat submit step 2:", err);
      setError("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
};



  return (
    <>
      {/* Jenis Ciptaan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Ciptaan</label>
        <div className="space-y-1">
          {[
            "Karya Seni",
            "Komposisi Musik",
            "Karya Audio Visual",
            "Karya Fotografi",
            "Karya Drama & Koreografi",
            "Karya Rekaman",
            "Karya Lainnya",
          ].map((item) => (
            <label key={item} className="flex items-center space-x-2">
              <input
                type="radio"
                name="jenisCiptaan"
                value={item}
                checked={formData.jenisCiptaan === item}
                onChange={handleChange}
                required
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Input lainnya */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Sub Jenis Ciptaan</label>
        <input
          type="text"
          name="subJenisCiptaan"
          value={formData.subJenisCiptaan}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Ciptaan</label>
        <input
          type="text"
          name="judulCiptaan"
          value={formData.judulCiptaan}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Uraian Singkat</label>
        <textarea
          name="uraianSingkat"
          value={formData.uraianSingkat}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Publish Pertama Kali</label>
        <input
          type="date"
          name="tanggalPublish"
          value={formData.tanggalPublish}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
      </div>
            <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Publish Pertama Kali</label>
        <input
          type="text"
          name="tempatPublish"
          value={formData.tempatPublish}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
      </div>
            {/* Pilih Metode Pembayaran */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        >
          <option value="mandiri">Mandiri</option>
          <option value="internal">Internal (Khusus Civitas Poltekba)</option>
        </select>
      </div>



      {/* Data Kuasa */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Data Kuasa</label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="menggunakanKuasa"
              value="Ya"
              checked={formData.menggunakanKuasa === "Ya"}
              onChange={handleChange}
              required
            />
            <span className="ml-2">Ya</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="menggunakanKuasa"
              value="Tidak"
              checked={formData.menggunakanKuasa === "Tidak"}
              onChange={handleChange}
            />
            <span className="ml-2">Tidak</span>
          </label>
        </div>
      </div>

      {formData.menggunakanKuasa === "Ya" && (
        <>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kuasa</label>
            <input
              type="text"
              name="namaKuasa"
              value={formData.namaKuasa}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap Kuasa</label>
            <textarea
              name="alamatKuasa"
              value={formData.alamatKuasa}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Kuasa</label>
            <input
              type="email"
              name="emailKuasa"
              value={formData.emailKuasa}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />
          </div>


        </>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Button Control */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-400"
        >
          Kembali
        </button>
        <button
          type="button"
          onClick={handleSubmitStep2}
          className="bg-[#272C7D] text-white px-6 py-2 rounded-md hover:bg-[#1e2370]"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Lanjut"}
        </button>
      </div>
    </>
  );
};

export default Step2;
