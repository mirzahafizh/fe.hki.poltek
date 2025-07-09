// src/components/ReviewModal.jsx
import { renderObjectAsForm } from "./RenderObjectAsForm";

const ReviewModal = ({
  selectedSubmission,
  formReview,
  handleInputChange,
  handleSubmitReview,
  closeModal,
  loading,
}) => {
  if (!selectedSubmission) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 overflow-auto">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">
          Review Ajuan - ID {selectedSubmission.id}
        </h2>

        {/* Render semua data lengkap dan form review dalam satu kolom */}
<div className="flex flex-col gap-6">
  {renderObjectAsForm(selectedSubmission)}

  <div>
    <label className="block mb-1 font-semibold" htmlFor="pesanReview">
      Pesan Review
    </label>
    <textarea
      id="pesanReview"
      name="pesanReview"
      rows={3}
      value={formReview.pesanReview}
      onChange={handleInputChange}
      className="w-full border rounded p-2"
    />
  </div>

  <div>
    <label className="block mb-1 font-semibold" htmlFor="statusReview">
      Status Review
    </label>
    <select
      id="statusReview"
      name="statusReview"
      value={formReview.statusReview}
      onChange={handleInputChange}
      className="w-full border rounded p-2"
    >
      <option value="revisi">Revisi</option>
      <option value="submit">Submit</option>
    </select>
  </div>

  <div>
    <label className="block mb-1 font-semibold" htmlFor="namaReviewer">
      Nama Reviewer
    </label>
    <input
      type="text"
      id="namaReviewer"
      name="namaReviewer"
      value={formReview.namaReviewer}
      onChange={handleInputChange}
      className="w-full border rounded p-2"
    />
  </div>
</div>

{/* tombol aksi tetap di bawah */}


        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleSubmitReview}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
