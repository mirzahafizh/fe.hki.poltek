import axios from "axios";
import { useEffect, useState } from "react";
import Step4 from "./StepFour"; // Previously Step3 renamed
import Step1 from "./StepOne";
import Step3 from "./StepThree";
import { default as handleSubmitStep2, default as Step2 } from "./StepTwo";


const NewPatentForm = () => {
  const [step, setStep] = useState(1);
  const [submissionId, setSubmissionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    suratPermohonanPembiayaanPaten: null,
    suratPengalihanHakKhusus2022: null,
    suratPernyataanKepemilikanInvensiOlehInventor: null,
    templateGambar: null,
    templateDeskripsi: null,
    suratPernyataanBelumKomersial: null,
  });

useEffect(() => {
  const paten = localStorage.getItem("Paten");
  const submissionId = localStorage.getItem("submissionIdPaten");
  const stepPaten = localStorage.getItem("patenStep");

  if (submissionId) setSubmissionId(submissionId);

  if (stepPaten === "4") {
    setStep(4);
  } else if (paten) {
    setStep(3);
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

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/submission-data`,
        {
          userId,
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

      const { submissionData, submission } = response.data;
      localStorage.setItem("submissionDataIdPaten", submissionData.id);
      localStorage.setItem("submissionIdPaten", submission.id);
      localStorage.setItem("Paten", 1);
      setSubmissionId(submission.id);

      setStep(2);
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim data awal.");
    }
  };



  return (
    <div className="max-w-3xl mx-auto bg-white p-8 mt-10 rounded-xl shadow-lg mb-10">
      <h2 className="text-2xl font-bold mb-6 text-[#272C7D]">Usulan Baru Paten</h2>

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
          handleSubmit={handleSubmitStep2}
          handleNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <Step3
          handleBack={() => setStep(2)}
          handleNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <Step4
          handleBack={() => setStep(3)}
          files={files}
          setFiles={setFiles}
        />
      )}
    </div>
  );
};

export default NewPatentForm;
