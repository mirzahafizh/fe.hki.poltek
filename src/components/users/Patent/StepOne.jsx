const Step1 = ({ formData, handleArrayChange, addField, handleNext }) => {
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleValidateAndNext = () => {
    const emails = formData.email;
    const isAllValid = emails.every((email) => isValidEmail(email));
    if (!isAllValid) {
      alert("Mohon masukkan alamat email yang valid.");
      return;
    }
    handleNext();
  };

  // Fungsi untuk menghapus field berdasarkan field name dan index
  const removeField = (field, index) => {
    if (formData[field].length === 1) return; // minimal satu field tetap ada
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    handleArrayChange(field, null, updatedArray);
  };

  return (
    <>
      {["nama", "email", "notelp", "alamat"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {field === "notelp" ? "No. Telepon" : field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          {formData[field].map((value, index) => (
            <div key={index} className="flex items-center mb-2 gap-2">
              <input
                type={
                  field === "email" ? "email" :
                  field === "notelp" ? "number" : "text"
                }
                value={value}
                onChange={(e) =>
                  handleArrayChange(
                    field,
                    index,
                    e.target.value
                  )
                }
                placeholder={`${field === "notelp" ? "No. Telepon" : field} ${index + 1}`}
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
            + Tambah {field === "notelp" ? "No. Telepon" : field.charAt(0).toUpperCase() + field.slice(1)}
          </button>
        </div>
      ))}

      <div className="pt-4">
        <button
          type="button"
          onClick={handleValidateAndNext}
          className="bg-[#272C7D] text-white px-6 py-2 rounded-md hover:bg-[#1e2370]"
        >
          Lanjut
        </button>
      </div>
    </>
  );
};

export default Step1;
