import axios from "axios";
import { useEffect, useState } from "react";
import Step1 from "./StepOne";
import { default as handleSubmitStep3, default as Step3 } from "./StepThree";
import Step2 from "./StepTwo";
const NewHkiForm = () => {
  const [step, setStep] = useState(1);
  const [submissionId, setSubmissionId] = useState(null);
    const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    nama: [""],
    email: [""],
    notelp: [""],
    alamat: [""],
    judul: "",
    jenis: "",
    inventor: "",
    deskripsi: "",
    tanggal: "",
  });
    const [files, setFiles] = useState({
    scanKTPPemohon: null,
    suratPernyataanPemohon: null,
    suratPernyataanPoltekba: null,
    contohCiptaan: null,
    suratPengalihanPoltekTtdDirektur: null,
  });
useEffect(() => {
  const hki = localStorage.getItem("HKI");
  const submissionDataId =localStorage.getItem("submissionDataIdHKI");

  const submissionId = localStorage.getItem("submissionIdHKI");

  if (hki) {
    setStep(3);
    if (submissionId) {
      setSubmissionId(submissionId);
    }
  }
}, []);


    const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0] || null,
    }));
  };
  
const handleArrayChange = (field, index, value) => {
  setFormData((prev) => {
    const updated = { ...prev };
    if (index === null) {
      // Replace entire array
      updated[field] = value;
    } else {
      updated[field][index] = value;
    }
    return updated;
  });
};

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleNextStep1 = async () => {
  if (
    !formData.nama.length || formData.nama[0].trim() === "" ||
    !formData.email.length || formData.email[0].trim() === "" ||
    !formData.notelp.length || formData.notelp[0].trim() === ""
  ) {
    alert("Harap isi minimal 1 data pada nama, email, dan no. telepon.");
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      alert("User belum login atau data user tidak ditemukan di localStorage.");
      return;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/submission-data`,
      {
        userId: userId,
        nama: formData.nama,
        email: formData.email,
        notelp: formData.notelp,
        alamat: formData.alamat,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { submissionData } = response.data;
    const { submission } = response.data;

    // ✅ Simpan submissionDataId ke localStorage
    localStorage.setItem("submissionDataIdHKI", submissionData.id);
    localStorage.setItem("submissionIdHKI", submission.id);
    localStorage.setItem("HKI",1)

    // Lanjut ke step berikutnya
    setStep(2);
  } catch (error) {
    console.error(error);
    alert("Gagal mengirim data awal. Silakan coba lagi.");
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
      setLoading(true);
    setMessage('');

    try {
      await axios.put(`http://localhost:3000/submission/${submissionId}`, {
        judul: formData.judul,
        jenis: formData.jenis,
        inventor: formData.inventor,
        deskripsi: formData.deskripsi,
        tanggal: formData.tanggal,
      });

      alert("Usulan HKI berhasil dikirim!");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengirim usulan HKI.");
    }
  };

//   const handleSubmitStep3 = async (e) => {
//   // e.preventDefault();
//   setLoading(true);
//   setMessage('');

//   if (!window.confirm("Apakah Anda yakin ingin mengirim usulan hak cipta?")) {
//     setLoading(false);
//     return;
//   }

//   const submissionId = localStorage.getItem("submissionId");
//   const token = localStorage.getItem("token");

//   if (!submissionId) {
//     setMessage("Submission ID tidak ditemukan di localStorage.");
//     setLoading(false);
//     return;
//   }
//   if (!token) {
//     setMessage("Auth token tidak ditemukan. Silakan login terlebih dahulu.");
//     setLoading(false);
//     return;
//   }

//   const formData = new FormData();
//   formData.append("submissionId", submissionId);

//   // files harus objek dengan key sesuai nama field multer dan value File object
//   Object.entries(files).forEach(([key, file]) => {
//     if (file) {
//       formData.append(key, file);
//     }
//   });

//   console.log("FormData entries:");
//   for (let pair of formData.entries()) {
//     console.log(pair[0], pair[1]);
//   }

//   try {
//     const response = await axios.post(
//       "http://localhost:3000/copyrights",
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // Jangan set Content-Type di sini, biarkan axios yang handle
//         },
//       }
//     );

//     setMessage("Berhasil mengirim usulan hak cipta.");
//     alert("Berhasil mengirim usulan hak cipta.");
//     console.log("Response:", response.data);

//   } catch (error) {
//     console.error(error);
//     setMessage("Gagal mengirim data. Silakan coba lagi.");
//     alert("Gagal mengirim data. Silakan coba lagi.");
//   } finally {
//     setLoading(false);
//   }
// };


  return (
    <div className="max-w-3xl mx-auto bg-white p-8 mt-10 rounded-xl shadow-lg shadow-gray-400 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-[#272C7D]">Usulan Baru HKI</h2>
      <form onSubmit={handleSubmit} className="space-y-5 ">
        {step === 1 && (
          <Step1
            formData={formData}
            handleArrayChange={handleArrayChange}
            addField={addField}
            handleNext={handleNextStep1}
          />
        )}
        {step === 2 && (
          <Step2
            formData={formData}
            handleChange={handleChange}
            handleBack={() => setStep(1)}
            handleNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
      <Step3
        handleBack={() => setStep(2)}
        handleSubmit={handleSubmitStep3}
        files={files}
        setFiles={setFiles}
      />
        )}
      </form>
    </div>
  );
};

export default NewHkiForm;
