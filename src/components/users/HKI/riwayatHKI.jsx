import axios from "axios";
import { useEffect, useState } from "react";
import FileLinkWithPreview from "../../dashboard/manajemenUsulan/FileLinkPreview";
import UploadBuktiPopup from "../UploadButki/uploadBuktiPopup";
import EditCopyrightPopup from "./editCopyrightPopup";
import EditSubmissionPopup from "./editSubmissionPopup";
const RiwayatHKI = () => {
  const [filter, setFilter] = useState("Semua");
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  // Untuk modal edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ id: null, judul: "", deskripsi: "" });
  const [editFileModalOpen, setEditFileModalOpen] = useState(false);
  const [editFileId, setEditFileId] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

useEffect(() => {
const fetchData = async () => {
  if (!userId) {
    setError("User tidak ditemukan di localStorage");
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/submissions/hki/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = response.data;
    const records = Array.isArray(result.data) ? result.data : [];

    const data = records.map((item) => {
      // Ambil review terakhir (jika ada)
      const latestReview =
        Array.isArray(item.reviews) && item.reviews.length > 0
          ? item.reviews[item.reviews.length - 1].pesanReview
          : "Tidak ada pesan";

      return {
        id: item.id,
        submissionDataId: item.submissionDataId,
        copyrightsId: item.copyrightsId,
        judul: item?.jenisCiptaan || "Tanpa Judul",
        deskripsi: item?.uraianSingkat || "Tanpa Deskripsi",
        tanggal: new Date(item.created_at).toLocaleDateString("id-ID"),
        status: item.statusSubmission || "Menunggu",
        kodeBilling: item?.kodeBilling || "Menunggu Kode Billing",
        paymentMethodId: item?.paymentMethodId || null,
        buktiPembayaran:
          item.payment_method?.buktiPembayaran || "Tidak ada bukti pembayaran",
        review: latestReview,
      };
    });

    setDataRiwayat(data);
  } catch (err) {
    console.error(err);
    setError("Gagal memuat data. Silakan coba lagi.");
  } finally {
    setLoading(false);
  }
};


  fetchData();
}, [userId, API_URL]);


  const handleFilter = (kategori) => {
    setFilter(kategori);
  };
  

  // Bukaan modal edit dan isi data yg diedit
const handleEdit = (id) => {
  setEditModalOpen(true);
  setEditData({ id }); // simpan keduanya
};

const handleEditFile = (id) => {
  setEditFileId(id);       // simpan ID yang mau diedit
  setEditFileModalOpen(true);
};

const handleEditFileClose = () => {
  setEditFileModalOpen(false);
  setEditFileId(null);     // optional reset ID saat popup ditutup
};

const handleEditClose = () => {
  setEditModalOpen(false);
  setEditData(null);
};

const handleEditSubmit = (updatedData) => {
  // update dataRiwayat atau panggil API update
  setDataRiwayat(prev => prev.map(item => item.id === updatedData.id ? updatedData : item));
  setEditModalOpen(false);
  setEditData(null);
};

  const handleDelete = async (submissionDataId) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      await axios.delete(`${API_URL}/submission/${submissionDataId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDataRiwayat((prev) => prev.filter((item) => item.submissionDataId !== submissionDataId));
      alert("Data berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
    }
  };

  const filters = [
    { label: "Semua", value: "all" },
    { label: "Disubmit", value: "disubmit" },
    { label: "Revisi", value: "revisi" },
    { label: "Submit DJKI", value: "submit" },
  ];

const filteredData = dataRiwayat.filter((item) => {
  if (filter === "Semua" || filter === "all") return true;
  return item.status.toLowerCase() === filter.toLowerCase();
});


  const showKodeBillingColumn = dataRiwayat.some(
    (item) => item.status.toLowerCase() === "submit"
  );
  const showBuktiPembayaranColumn = dataRiwayat.some(
    (item) => item.status.toLowerCase() === "submit"
  );

  const handleUploadBukti = (paymentMethodId) => {
    setSelectedPaymentId(paymentMethodId);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedPaymentId(null);
  };

  const refreshData = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg shadow-gray-400">
      <h1 className="text-xl font-bold mb-4">Riwayat Pengusulan HKI</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {filters.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleFilter(value)}
            className={`px-4 py-2 rounded-md border ${
              filter === value
                ? "bg-[#272C7D] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading/Error */}
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredData.length === 0 ? (
        <p className="text-gray-500">Tidak ada data untuk ditampilkan.</p>
      ) : (
        <>
          {/* Table */}
 <div className="overflow-x-auto">
  <table className="min-w-full border border-gray-300 rounded-lg">
    <thead className="bg-gray-100 text-gray-700">
      <tr>
        <th className="text-left px-4 py-2 border-b">Jenis Ciptaan</th>
        <th className="text-left px-4 py-2 border-b">Deskripsi Singkat</th>
        <th className="text-left px-4 py-2 border-b">Tanggal</th>
        <th className="text-left px-4 py-2 border-b">Status</th>
        <th className="text-left px-4 py-2 border-b">Pesan Review</th>
        {showKodeBillingColumn && (
          <th className="text-left px-4 py-2 border-b">Kode Billing</th>
        )}
        {showBuktiPembayaranColumn && (
          <th className="text-left px-4 py-2 border-b">Bukti Pembayaran</th>
        )}
        <th className="text-left px-4 py-2 border-b">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {filteredData.map((item) => (
        <tr key={item.id} className="hover:bg-gray-50">
          <td className="px-4 py-2 border-b">{item.judul}</td>
          <td className="px-4 py-2 border-b">{item.deskripsi}</td>
          <td className="px-4 py-2 border-b">{item.tanggal}</td>
          <td className="px-4 py-2 border-b">{item.status}</td>
          <td className="px-4 py-2 border-b">{item.review}</td>
          {showKodeBillingColumn && (
            <td className="px-4 py-2 border-b">
              {item.status.toLowerCase() === "submit" ? item.kodeBilling : "-"}
            </td>
          )}
{showBuktiPembayaranColumn && (
  <td className="px-4 py-2 border-b">
    {item.status.toLowerCase() === "submit" ? (
      item.buktiPembayaran &&
      item.buktiPembayaran.toLowerCase() !== "tidak ada bukti pembayaran" ? (
        <FileLinkWithPreview
          fileUrl={
            item.buktiPembayaran.startsWith("http")
              ? item.buktiPembayaran
              : `${import.meta.env.VITE_API_URL_FILE}/storage/${item.buktiPembayaran}`
          }
          label="Lihat Bukti"
        />
      ) : (
        <span className="text-gray-500">Belum diupload</span>
      )
    ) : null}
  </td>
)}


<td className="px-4 py-2 border-b">
  <div className="flex flex-wrap gap-2 justify-start">
    {item.status.toLowerCase() === "submit" ? (
  <button
    onClick={() => handleUploadBukti(item.paymentMethodId)}
    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex-1 min-w-[90px] text-center"
  >
    Upload Bukti
  </button>
) : item.status.toLowerCase() === "revisi" ? (
  <>
    <button
      onClick={() => handleEdit(item.id)}
      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex-1 min-w-[90px] text-center"
    >
      Edit
    </button>
    <button
      onClick={() => handleEditFile(item.copyrightsId)}
      className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 flex-1 min-w-[90px] text-center"
    >
      Edit File
    </button>
  </>
) : item.status.toLowerCase() === "sendcertificate" ? (
  <p className="text-sm text-green-600">Cek email Anda</p>
) : (
  <>
    <button
      onClick={() => handleEdit(item.id)}
      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex-1 min-w-[90px] text-center"
    >
      Edit
    </button>
    <button
      onClick={() => handleEditFile(item.copyrightsId)}
      className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 flex-1 min-w-[90px] text-center"
    >
      Edit File
    </button>
    <button
      onClick={() => handleDelete(item.submissionDataId)}
      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 flex-1 min-w-[90px] text-center"
    >
      Hapus
    </button>
  </>
)}

  </div>
</td>


        </tr>
      ))}
    </tbody>
  </table>
</div>


        </>
      )}

      {/* Popup Upload Bukti Pembayaran */}
      <UploadBuktiPopup
        isOpen={popupOpen}
        onClose={handleClosePopup}
        paymentId={selectedPaymentId}
        onSuccess={refreshData}
      />
      <EditSubmissionPopup
        isOpen={editModalOpen}
        onClose={handleEditClose}
        submissionId={editData?.id}
        onSuccess={() => {
          // refresh data setelah edit berhasil
          // bisa panggil fetch ulang API atau reload page
          window.location.reload();
        }}
      />
            {/* Popup Edit Copyright */}
      <EditCopyrightPopup
        isOpen={editFileModalOpen}
        onClose={handleEditFileClose}
        id={editFileId}      // Kirim ID yang disimpan di state
        onSuccess={() => {
          window.location.reload();
        }}
      />


    </div>
  );
};

export default RiwayatHKI;
