// src/components/SubmissionTable.jsx

const SubmissionTable = ({ data, onReviewClick }) => {
  const showActionColumn = data.some(
    (item) =>
      item.statusSubmission.toLowerCase() === "revisi" ||
      item.statusSubmission.toLowerCase() === "disubmit"
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr className="bg-[#272C7D] text-white text-left">
            <th className="border p-2">No</th>
            <th className="border p-2">Jenis Ciptaan</th>
            <th className="border p-2">Sub Jenis</th>
            <th className="border p-2">Judul Ciptaan</th>
            <th className="border p-2">Tanggal Publish</th>
            <th className="border p-2">Status</th>
            {showActionColumn && <th className="border p-2">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.slice(0, 20).map((item, index) => {
              const showReviewButton =
                item.statusSubmission.toLowerCase() === "revisi" ||
                item.statusSubmission.toLowerCase() === "disubmit";

              return (
                <tr key={item.id} className="border-t">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{item.jenisCiptaan}</td>
                  <td className="border p-2">{item.subJenisCiptaan}</td>
                  <td className="border p-2">{item.judulCiptaan}</td>
                  <td className="border p-2">
                    {new Date(item.tanggalPublish).toLocaleDateString("id-ID")}
                  </td>
                  <td className="border p-2">{item.statusSubmission}</td>
                  {showActionColumn && (
                    <td className="border p-2">
                      {showReviewButton && (
                        <button
                          onClick={() => onReviewClick(item)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={showActionColumn ? 7 : 6}
                className="p-4 text-center text-gray-500"
              >
                Tidak ada data dengan status tersebut
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionTable;
