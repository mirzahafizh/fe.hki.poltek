import FileLinkWithPreview from "./FileLinkPreview";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  return d.toISOString().split("T")[0];
};

const formatKeyLabel = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const renderValueAsField = (val, key, rootObj = {}) => {
  const label = formatKeyLabel(key);

  if (val === null || val === undefined || val === "") val = "-";

  // Parse array jika string JSON
  if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) val = parsed;
    } catch {}
  }

  if (Array.isArray(val)) {
    const flattened = val
      .map((item) => (typeof item === "string" ? item.split(",") : item))
      .flat()
      .map((item) => item.trim())
      .filter(Boolean);

    return (
      <ol className="list-decimal list-inside bg-gray-100 p-2 rounded border border-black">
        {flattened.map((item, idx) => (
          <li key={idx}>{item || "-"}</li>
        ))}
      </ol>
    );
  }

  if (typeof val === "object") {
    return renderObjectAsForm(val, rootObj);
  }

  if (key.toLowerCase().includes("tanggal") || key.toLowerCase().includes("date")) {
    return (
      <input
        type="text"
        readOnly
        value={formatDate(val)}
        className="w-full border rounded px-2 py-1 bg-gray-100"
      />
    );
  }

  const lowerVal = val?.toString().toLowerCase() || "";
  const isFile =
    lowerVal.endsWith(".pdf") ||
    lowerVal.endsWith(".jpg") ||
    lowerVal.endsWith(".jpeg") ||
    lowerVal.endsWith(".png");

  if (isFile) {
    const fileBaseUrl = import.meta.env.VITE_API_URL_FILE;
    const submissionId = rootObj.submissionId || rootObj.id || "";

    let filePath = "";

    // Cek apakah val sudah mengandung path (misalnya 'copyrights/23/AIR.pdf')
    const isAlreadyFullPath = val.includes("/") || val.startsWith("http");

    if (isAlreadyFullPath) {
      filePath = val;
    } else if (rootObj.patentId) {
      filePath = `patents/${submissionId}/${val}`;
    } else if (rootObj.copyrightsId) {
      filePath = `copyrights/${submissionId}/${val}`;
    } else {
      filePath = val;
    }

    const url = filePath.startsWith("http")
      ? filePath
      : `${fileBaseUrl}/storage/${filePath}`;

    return <FileLinkWithPreview fileUrl={url} label={label} />;
  }

  return (
    <input
      type="text"
      readOnly
      value={val}
      className="w-full border rounded px-2 py-1 bg-gray-100"
    />
  );
};

export const renderObjectAsForm = (obj, rootObj = null) => {
  if (!obj || typeof obj !== "object") return null;

  const baseObj = rootObj || obj;
  const hasPatent = !!baseObj.patentId;
  const hasCopyright = !!baseObj.copyrightsId;
  const status = (baseObj.statusSubmission || "").toLowerCase();

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(obj).map(([key, val]) => {
        const lowerKey = key.toLowerCase();

        if (lowerKey.includes("id")) return null;
        if (lowerKey.includes("user")) return null;
        if (["createdat", "updatedat"].includes(lowerKey)) return null;
        if (
          ["namakuasa", "alamatkuasa", "emailkuasa"].includes(lowerKey) &&
          (val === null || val === "")
        )
          return null;
        if (hasPatent && (lowerKey.startsWith("copyright") || lowerKey === "copyright"))
          return null;
        if (hasCopyright && (lowerKey.startsWith("patent") || lowerKey === "patent"))
          return null;
        if (
          status === "disubmit" &&
          ["review", "reviews", "kodebilling"].includes(lowerKey)
        )
          return null;

        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formatKeyLabel(key)}
            </label>
            {renderValueAsField(val, key, baseObj)}
          </div>
        );
      })}
    </div>
  );
};
