import axios from "axios";
import { useEffect, useState } from "react";
import FileLinkWithPreview from "../manajemenUsulan/FileLinkPreview";

const BillingInput = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [kodeBilling, setKodeBilling] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [sendingId, setSendingId] = useState(null);
const [modalSubmissionId, setModalSubmissionId] = useState(null);

  // Modal Kirim Sertifikat
  const [showModal, setShowModal] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter((item) => item.statusSubmission === "submit");
      setSubmissions(filtered);
    } catch (err) {
      console.error("Gagal mengambil data submission:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSubmitKodeBilling = async (submissionDataId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/submission/update-kode-billing/${submissionDataId}`,
        { kodeBilling },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Kode billing berhasil disimpan.");
      setSelectedId(null);
      setKodeBilling("");
      fetchSubmissions();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan kode billing.");
    }
  };

  const handleVerifyPayment = async (paymentMethodId) => {
    try {
      setVerifyingId(paymentMethodId);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/${paymentMethodId}/accept`,
        { statusPembayaran: "sudah dibayar" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Pembayaran berhasil diverifikasi.");
      fetchSubmissions();
    } catch (err) {
      console.error(err);
      alert("Gagal memverifikasi pembayaran.");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleSendCertificate = async () => {
  try {
    setSendingId(modalUserId); // Mulai loading
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", selectedFile);

    // Gunakan modalUserId dan modalSubmissionId, bukan userId yang tidak didefinisikan
    await axios.post(
      `${import.meta.env.VITE_API_URL}/submissions/send-certificate/${modalUserId}/${modalSubmissionId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Sertifikat berhasil dikirim ke email.");
    setSelectedFile(null);
    setShowModal(false);
    setModalSubmissionId(null);
  } catch (error) {
    console.error("Gagal mengirim sertifikat:", error);
    alert(error.response?.data?.message || "Gagal mengirim sertifikat.");
  } finally {
    setSendingId(null);
  }
};


  return (
    <div className="p-6">
      {/* Spinner saat loading */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <span className="text-blue-700 font-medium">Memuat data pengumuman...</span>
          </div>
        </div>
      )}

      {/* Konten utama setelah loading selesai */}
      {!loading && (
        <>
          <h2 className="text-xl font-bold mb-4">Input Kode Billing</h2>

          {submissions.length === 0 ? (
            <p>
              Tidak ada ajuan dengan status <strong>"submit"</strong>.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr className="bg-[#272C7D] text-white">
                    <th className="border px-4 py-2">Judul</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Status Pembayaran</th>
                    <th className="border px-4 py-2">Kode Billing</th>
                    <th className="border px-4 py-2">Bukti Pembayaran</th>
                    <th className="border px-4 py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((item) => (
                    <tr key={item.submissionDataId} className="border-b">
                      <td className="border px-4 py-2">{item.judulCiptaan}</td>
                      <td className="border px-4 py-2">{item.statusSubmission}</td>
                      <td className="border px-4 py-2">
                        {item.payment_method?.statusPembayaran || "-"}
                      </td>
                      <td className="border px-4 py-2">
                        {item.kodeBilling || "Belum diisi"}
                      </td>
                      <td className="border px-4 py-2">
                        {item.payment_method?.buktiPembayaran ? (
                          <FileLinkWithPreview
                            fileUrl={item.payment_method?.buktiPembayaran}
                            label="Lihat Bukti"
                          />
                        ) : (
                          "Belum diisi"
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {selectedId === item.submissionDataId ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              className="border p-1 rounded w-full sm:w-40"
                              placeholder="Masukkan kode billing"
                              value={kodeBilling}
                              onChange={(e) => setKodeBilling(e.target.value)}
                            />
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  handleSubmitKodeBilling(item.submissionDataId)
                                }
                                className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedId(null);
                                  setKodeBilling("");
                                }}
                                className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 text-xs"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {!item.kodeBilling && (
                              <button
                                onClick={() => {
                                  setSelectedId(item.submissionDataId);
                                  setKodeBilling(item.kodeBilling || "");
                                }}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs block w-full text-center"
                              >
                                Input Kode Billing
                              </button>
                            )}

                            {item.kodeBilling &&
                              item.user?.nomorHp &&
                              item.payment_method?.statusPembayaran !== "sudah dibayar" && (
                                <a
                                  href={`https://wa.me/62${item.user.nomorHp}?text=${encodeURIComponent(
                                    `Halo, berikut kode billing untuk pengajuan Kekayaan Intelektual Anda: ${item.kodeBilling}`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs block w-full text-center"
                                >
                                  Kirim ke WhatsApp
                                </a>
                              )}

                            {item.payment_method &&
                              item.payment_method.statusPembayaran !== "sudah dibayar" &&
                              item.payment_method?.buktiPembayaran && (
                                <button
                                  onClick={() =>
                                    handleVerifyPayment(item.payment_method.id)
                                  }
                                  disabled={verifyingId === item.payment_method.id}
                                  className={`mt-1 w-full px-3 py-1 rounded text-white text-xs ${
                                    verifyingId === item.payment_method.id
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-purple-600 hover:bg-purple-700"
                                  }`}
                                >
                                  {verifyingId === item.payment_method.id
                                    ? "Memverifikasi..."
                                    : "Verifikasi Pembayaran"}
                                </button>
                              )}

                            {item.payment_method?.statusPembayaran === "sudah dibayar" &&
                              item.user?.id && (
                                <button
                                  onClick={() => {
                                    setModalUserId(item.user.id);
                                    setShowModal(true);
                                    setModalSubmissionId(item.id);
                                  }}
                                  className="mt-1 w-full px-3 py-1 rounded text-white text-xs bg-teal-600 hover:bg-teal-700"
                                >
                                  Kirim Sertifikat ke Email
                                </button>
                              )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal Upload Sertifikat */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Kirim Sertifikat</h3>

                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="mb-4 w-full border p-2 rounded"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedFile(null);
                    }}
                    className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSendCertificate}
                    disabled={!selectedFile || sendingId === modalUserId}
                    className={`px-4 py-1 rounded text-white ${
                      !selectedFile || sendingId === modalUserId
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {sendingId === modalUserId ? "Mengirim..." : "Kirim"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BillingInput;
