import axios from "axios";
import { useEffect, useState } from "react";

const UserSubmissionCard = () => {
  const [submissionCounts, setSubmissionCounts] = useState({ total: 0, revisi: 0, submit: 0 });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const submissions = res.data.submissions || [];

        const counts = submissions.reduce(
          (acc, sub) => {
            const status = sub.statusSubmission?.toLowerCase();

            acc.total += 1;
            if (status === "revisi") acc.revisi += 1;
            if (status === "submit") acc.submit += 1;

            return acc;
          },
          { total: 0, revisi: 0, submit: 0 }
        );

        setSubmissionCounts(counts);
      } catch (error) {
        console.error("Gagal mengambil data submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [API_URL, user.id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800">Total Ajuan</h2>
        <p className="text-4xl text-blue-600 mt-2">{submissionCounts.total}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800">Ajuan Revisi</h2>
        <p className="text-4xl text-yellow-500 mt-2">{submissionCounts.revisi}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800">Ajuan Submit DJKI</h2>
        <p className="text-4xl text-green-600 mt-2">{submissionCounts.submit}</p>
      </div>
    </div>
  );
};

export default UserSubmissionCard;
