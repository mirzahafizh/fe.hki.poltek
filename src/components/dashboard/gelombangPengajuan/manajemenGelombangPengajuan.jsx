import axios from 'axios';
import { useEffect, useState } from 'react';
import BatchTable from './tabelGelombangPengajuan'; // Pastikan path ini sesuai

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
const [loading, setLoading] = useState(true);
  const apiUrl = `${import.meta.env.VITE_API_URL}/batches`;

  const fetchBatches = async () => {
    try {
      const res = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBatches(res.data);
      setLoading(false)
    } catch (err) {
      setMessage('Gagal mengambil data gelombang.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus gelombang ini?')) return;
    try {
      await axios.delete(`${apiUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Gelombang berhasil dihapus.');
      fetchBatches();
    } catch (err) {
      setMessage('Gagal menghapus gelombang.');
    }
  };

  const handleEdit = (batch) => {
    alert(`Edit gelombang: ${batch.id}`);
    // Bisa diarahkan ke halaman edit atau tampilkan modal di sini
  };

  useEffect(() => {
    fetchBatches();
  }, []);

return (
  <div className="p-6 max-w-8xl mx-auto">
    {/* Spinner saat loading */}
    {loading ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <span className="text-blue-700 font-medium">Memuat data gelombang...</span>
        </div>
      </div>
    ) : (
      <>
        <h2 className="text-xl font-semibold mb-4">Manajemen Gelombang Pengajuan</h2>

        {message && (
          <div className="mb-4 px-4 py-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {message}
          </div>
        )}

        <BatchTable batches={batches} onDelete={handleDelete} onEdit={handleEdit} />
      </>
    )}
  </div>
);

};

export default BatchList;
