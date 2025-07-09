import { useState } from 'react';

const BatchTable = ({ batches, onDelete }) => {
  const [editingBatch, setEditingBatch] = useState(null);
  const [editData, setEditData] = useState({ tanggal_mulai: '', tanggal_selesai: '' });
  const [loading, setLoading] = useState(false); // untuk modal loading

  const openEditModal = (batch) => {
    setEditingBatch(batch);
    setEditData({
      tanggal_mulai: batch.tanggal_mulai.slice(0, 10),
      tanggal_selesai: batch.tanggal_selesai.slice(0, 10),
    });
  };

  const closeModal = () => {
    setEditingBatch(null);
    setEditData({ tanggal_mulai: '', tanggal_selesai: '' });
    setLoading(false);
  };

  const saveEdit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const apiUrl = `${import.meta.env.VITE_API_URL}/batches/${editingBatch.id}`;
      await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      closeModal();
      window.location.reload(); // atau panggil ulang fetchBatches
    } catch (err) {
      setLoading(false);
      alert('Gagal menyimpan perubahan.');
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr className="bg-[#272C7D] text-white">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Tanggal Mulai</th>
              <th className="px-4 py-2 border">Tanggal Selesai</th>
              <th className="px-4 py-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch, index) => (
              <tr key={batch.id} className="text-center">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{batch.tanggal_mulai.slice(0, 10)}</td>
                <td className="px-4 py-2 border">{batch.tanggal_selesai.slice(0, 10)}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => openEditModal(batch)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(batch.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Edit */}
        {editingBatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <h2 className="text-xl font-semibold mb-4">Edit Gelombang</h2>
              <label className="block mb-2">
                Tanggal Mulai:
                <input
                  type="date"
                  value={editData.tanggal_mulai}
                  onChange={(e) => setEditData({ ...editData, tanggal_mulai: e.target.value })}
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </label>
              <label className="block mb-4">
                Tanggal Selesai:
                <input
                  type="date"
                  value={editData.tanggal_selesai}
                  onChange={(e) => setEditData({ ...editData, tanggal_selesai: e.target.value })}
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
                  disabled={loading}
                >
                  Simpan
                </button>
              </div>

              {/* Spinner Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BatchTable;
