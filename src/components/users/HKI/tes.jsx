import axios from 'axios';
import { useState } from 'react';

export default function UploadCopyright() {
  const [files, setFiles] = useState({
    scanKTPPemohon: null,
    suratPernyataanPemohon: null,
    suratPernyataanPoltekba: null,
    contohCiptaan: null,
    suratPengalihanPoltekTtdDirektur: null,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Ambil token dan submissionId dari localStorage
  const token = localStorage.getItem('token'); // misal key-nya 'authToken'
  const submissionId = localStorage.getItem('submissionId'); // misal key-nya 'submissionId'

  // Handle input change for files
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: files[0] || null,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submissionId) {
      setMessage('Submission ID not found in localStorage.');
      return;
    }

    if (!token) {
      setMessage('Auth token not found. Please login.');
      return;
    }

    const formData = new FormData();
    formData.append('submissionId', submissionId);

    // Append all files if exist
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    try {
      setLoading(true);
      setMessage('');

      const response = await axios.post(
        'http://localhost:3000/copyrights', // Ganti sesuai endpoint mu
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Upload success! ' + JSON.stringify(response.data));
    } catch (error) {
      setMessage(
        'Upload failed: ' +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Upload Copyright</h2>
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Scan KTP Pemohon', name: 'scanKTPPemohon' },
          { label: 'Surat Pernyataan Pemohon', name: 'suratPernyataanPemohon' },
          { label: 'Surat Pernyataan Poltekba', name: 'suratPernyataanPoltekba' },
          { label: 'Contoh Ciptaan', name: 'contohCiptaan' },
          { label: 'Surat Pengalihan Poltek Ttd Direktur', name: 'suratPengalihanPoltekTtdDirektur' },
        ].map(({ label, name }) => (
          <div key={name} style={{ marginBottom: 12 }}>
            <label>
              {label}:
              <input
                type="file"
                name={name}
                onChange={handleFileChange}
                accept="application/pdf,image/*"
              />
            </label>
          </div>
        ))}

        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: 20, whiteSpace: 'pre-wrap' }}>
          {message}
        </div>
      )}
    </div>
  );
}
