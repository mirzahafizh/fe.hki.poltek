import axios from "axios";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Navbar from "../../components/dashboard/navbar";
import Sidebar from "../../components/dashboard/sidebar";

const Dashboard = () => {
  const [submissionData, setSubmissionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubmissionData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data submission:", error);
      }
    };

    fetchData();
  }, []);

  const total = submissionData.length;
  const waiting = submissionData.filter((item) => item.statusSubmission === "disubmit").length;
  const reviewed = submissionData.filter((item) => item.statusSubmission === "direview").length;
  const revised = submissionData.filter((item) => item.statusSubmission === "revisi").length;
  const approved = submissionData.filter((item) => item.statusSubmission === "submit").length;
  const send = submissionData.filter((item) => item.statusSubmission === "sendCertificate").length;

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  // Tambahkan 8 jam (GMT+8) untuk WITA
  date.setHours(date.getHours() + 8);
  return date.toISOString().split("T")[0];
};


const generateCumulativeChart = (data, type) => {
  const dailyCounts = {};

  data.forEach((item) => {
    // Hanya ambil yang sudah terbit dan memiliki ID sesuai (copyrights/patent)
    if (
      item[`${type}Id`] &&
      item.created_at &&
      item.statusSubmission === "sendCertificate" // tambahkan kondisi ini
    ) {
      const date = formatDate(item.created_at);
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    }
  });

  // Urutkan tanggal
  const sortedDates = Object.keys(dailyCounts).sort();

  const chartData = [];
  let cumulativeTotal = 0;

  sortedDates.forEach((date) => {
    cumulativeTotal += dailyCounts[date];
    chartData.push({ tanggal: date, jumlah: cumulativeTotal });
  });

  return chartData;
};


const copyrightChart = generateCumulativeChart(submissionData, "copyrights");
const patentChart = generateCumulativeChart(submissionData, "patent");

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-6 bg-gray-100 min-h-screen">
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-xl font-bold mb-4">Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              {/* Kartu Informasi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
                <div className="bg-[#8802a3] text-white p-4 rounded shadow">
                  <h2 className="text-lg font-semibold">Total Ajuan</h2>
                  <p className="text-2xl">{total}</p>
                </div>
                <div className="bg-gray-500 text-white p-4 rounded shadow">
                  <h2 className="text-lg font-semibold">Menunggu Review</h2>
                  <p className="text-2xl">{waiting}</p>
                </div>
                <div className="bg-red-500 text-white p-4 rounded shadow">
                  <h2 className="text-lg font-semibold">Revisi</h2>
                  <p className="text-2xl">{revised}</p>
                </div>
                <div className="bg-green-600 text-white p-4 rounded shadow ">
                  <h2 className="text-lg font-semibold">Submit DJKI</h2>
                  <p className="text-2xl">{approved}</p>
                </div>
                <div className="bg-teal-500 text-white p-4 rounded shadow">
                  <h2 className="text-lg font-semibold">Sertifikat Terkirim</h2>
                  <p className="text-2xl">{send}</p>
                </div>
              </div>

              {/* Grafik */}
              <div className="flex flex-col gap-4 col-span-2">
                {/* Grafik Hak Cipta */}
                <div className="bg-white border p-4 rounded shadow h-64">
                  <h3 className="text-md font-bold mb-2 text-center">Statistik Hak Cipta</h3>
                  <ResponsiveContainer width="100%" height="90%">
  <LineChart data={copyrightChart}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="tanggal" />
    <YAxis allowDecimals={false} />
    <Tooltip />
    <Line type="monotone" dataKey="jumlah" stroke="#8884d8" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>

                </div>

                {/* Grafik Paten */}
                <div className="bg-white border p-4 rounded shadow h-64">
                  <h3 className="text-md font-bold mb-2 text-center">Statistik Paten</h3>
                  <ResponsiveContainer width="100%" height="90%">
  <LineChart data={patentChart}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="tanggal" />
    <YAxis allowDecimals={false} />
    <Tooltip />
    <Line type="monotone" dataKey="jumlah" stroke="#82ca9d" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>

                </div>
              </div>
            </div>

            {/* Tabel Ajuan */}
            <div>
              <h2 className="text-xl font-bold mb-4">Ajuan yang Belum Direview</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr className="bg-[#272C7D] text-white">
                      <th className="border p-2">No</th>
                      <th className="border p-2">Jenis Ciptaan</th>
                      <th className="border p-2">Sub Jenis</th>
                      <th className="border p-2">Tanggal Dibuat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissionData
                      .filter((item) => item.statusSubmission === "disubmit")
                      .slice(0, 5)
                      .map((item, index) => (
                        <tr key={item.id} className="border-t">
                          <td className="border p-2">{index + 1}</td>
                          <td className="border p-2">{item.jenisCiptaan}</td>
                          <td className="border p-2">{item.subJenisCiptaan}</td>
                          <td className="border p-2">
                            {formatDate(item.created_at)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
