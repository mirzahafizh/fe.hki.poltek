import axios from 'axios';
import { useState } from 'react';

const CreateBatch = () => {
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!tanggalMulai || !tanggalSelesai) {
    setMessage('Semua tanggal harus diisi.');
    return;
  }

  if (new Date(tanggalMulai) > new Date(tanggalSelesai)) {
    setMessage('Tanggal mulai tidak boleh setelah tanggal selesai.');
    return;
  }

  try {
    const token = localStorage.getItem('token'); // atau sessionStorage jika kamu simpan di sana
    const apiUrl = `${import.meta.env.VITE_API_URL}/batches`;

    await axios.post(
  apiUrl,
  {
    tanggalMulai: tanggalMulai,
    tanggalSelesai: tanggalSelesai
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);


    alert('Gelombang pengajuan berhasil dibuat.');
    setTanggalMulai('');
    setTanggalSelesai('');
  } catch (error) {
    setMessage(
      error.response?.data?.message || 'Terjadi kesalahan saat membuat gelombang.'
    );
  }
};


  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Buat Gelombang Pengajuan</h2>


      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tanggal Mulai</label>
          <input
            type="date"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Tanggal Selesai</label>
          <input
            type="date"
            value={tanggalSelesai}
            onChange={(e) => setTanggalSelesai(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#272C7D] text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          Simpan Gelombang
        </button>
      </form>
    </div>
  );
};

export default CreateBatch;
