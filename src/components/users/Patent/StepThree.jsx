import axios from "axios";
import { useState } from "react";

const Step3 = ({ handleNext, handleBack }) => {
  const [formData, setFormData] = useState({
    nomor: '',
    jenisPermohonan: '',
    judul: '',
    unitKerja: '',
    skemaPenelitianTahun: '',
    pekerjaan: [''],
    alamatRumah: [''],
    alamatKantor: [''],
    noTelpRumah: [''],
    noTelpKantor: [''],
    noHandphone: [''],
    kewarganegaraan: [''],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const addField = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeField = (field, index) => {
    if (formData[field].length === 1) return;
    const updated = [...formData[field]];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nomor) newErrors.nomor = "Nomor wajib diisi";
    if (!formData.judul) newErrors.judul = "Judul wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitData = async () => {
    if (!validate()) return;

    setLoading(true);
    setMessage('');
    const submissionId = localStorage.getItem("submissionIdPaten");
    const token = localStorage.getItem("token");

    if (!submissionId || !token) {
      setMessage("Submission ID atau token tidak ditemukan.");
      setLoading(false);
      return;
    }

    const form = new FormData();
    form.append("submissionId", submissionId);

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => form.append(`${key}[]`, v));
      } else {
        form.append(key, value);
      }
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/patents`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { patent } = response.data;
      localStorage.setItem("patentId", patent.id);
      setMessage("Data berhasil disimpan.");
      localStorage.setItem("patenStep", "4"); // ✅ update step
      handleNext();
    }  catch (error) {
  console.error("Response error:", error.response?.data); // Tampilkan pesan Laravel
  setMessage("Gagal mengirim data. Silakan cek isian Anda.");


    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">Informasi Tambahan Paten</h2>

    {/* Nomor */}
    <div>
      <label className="block mb-1">Nomor</label>
      <input
        name="nomor"
        value={formData.nomor}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        required
      />
      {errors.nomor && <p className="text-sm text-red-500">{errors.nomor}</p>}
    </div>

    {/* Jenis Permohonan */}
    <div>
      <label className="block mb-1">Jenis Permohonan</label>
      <select
        name="jenisPermohonan"
        value={formData.jenisPermohonan}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        required
      >
        <option value="">-- Pilih Jenis Permohonan --</option>
        <option value="Paten">Paten</option>
        <option value="Paten Sederhana">Paten Sederhana</option>
      </select>
    </div>

    {/* Judul, Unit Kerja, Skema */}
    {[
      { name: 'judul', label: 'Judul' },
      { name: 'unitKerja', label: 'Unit Kerja' },
      { name: 'skemaPenelitianTahun', label: 'Skema Penelitian Tahun' },
    ].map(({ name, label }) => (
      <div key={name}>
        <label className="block mb-1">{label}</label>
        <input
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        {errors[name] && <p className="text-sm text-red-500">{errors[name]}</p>}
      </div>
    ))}

    {/* Field array (dengan tambah & hapus) */}
    {[
      'pekerjaan',
      'alamatRumah',
      'alamatKantor',
      'noTelpRumah',
      'noTelpKantor',
      'noHandphone',
      'kewarganegaraan',
    ].map((field) => (
      <div key={field} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
          {field.replace(/([A-Z])/g, ' $1')}
        </label>
        {formData[field]?.map((value, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={value}
              onChange={(e) => handleArrayChange(field, index, e.target.value)}
              placeholder={`${field} ${index + 1}`}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required={index === 0}
            />
            {formData[field].length > 1 && (
              <button
                type="button"
                onClick={() => removeField(field, index)}
                className="text-red-500 text-sm hover:underline"
              >
                Hapus
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField(field)}
          className="text-sm text-blue-600 hover:underline"
        >
          + Tambah {field}
        </button>
      </div>
    ))}

    {/* Button control */}
    <div className="flex justify-between mt-6">
      <button
        type="button"
        onClick={handleBack}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Kembali
      </button>
      <button
        type="button"
        onClick={submitData}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Menyimpan...' : 'Selanjutnya'}
      </button>
    </div>

    {message && <p className="text-sm text-center text-red-600 mt-2">{message}</p>}
  </div>
);

};

export default Step3;
