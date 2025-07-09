// File: FileLinkWithPreview.jsx
import { useState } from "react";


const FileLinkWithPreview = ({ fileUrl, label }) => {
  const [showModal, setShowModal] = useState(false);

  const isPdf = fileUrl.toLowerCase().endsWith(".pdf");
  const isImage =
    fileUrl.toLowerCase().endsWith(".jpg") ||
    fileUrl.toLowerCase().endsWith(".jpeg") ||
    fileUrl.toLowerCase().endsWith(".png");

  const handleOpenPreview = () => {
    console.log(`[LOG] File dibuka: ${fileUrl}`);
    setShowModal(true);
  };
  
  const handleOpenAndDownload = () => {
    // Buka tab baru untuk preview
    const win = window.open(fileUrl, "_blank");

    // Jika ingin juga memaksa download
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", ""); // Gunakan nama file jika perlu
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      <button
        className="text-blue-600 underline"
        onClick={handleOpenPreview}
        type="button"
      >
        {label}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-4 rounded max-w-6xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{label}</h3>
              <button
                className="text-red-600 font-bold text-[32px]"
                onClick={() => setShowModal(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              {isPdf && (
                <iframe
                  src={fileUrl}
                  width="100%"
                  height="600px"
                  title={label}
                />
              )}
              {isImage && (
                <img
                  src={fileUrl}
                  alt={label}
                  className="max-w-full max-h-96"
                />
              )}
              {!isPdf && !isImage && (
                <p>Preview tidak tersedia untuk jenis file ini.</p>
              )}
            </div>


          </div>
        </div>
      )}
    </>
  );
};

export default FileLinkWithPreview;
