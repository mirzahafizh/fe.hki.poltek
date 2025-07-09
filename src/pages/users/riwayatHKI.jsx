import { useState } from "react";
import Headbar from "../../components/HeadBar";
import NavbarUsers from "../../components/NavbarUsers";
import RiwayatHKI from "../../components/users/HKI/riwayatHKI";

const RiwayatHKIPages = () => {
  const [filter, setFilter] = useState("Semua");


  const handleFilter = (kategori) => {
    setFilter(kategori);
  };

  return (
        <div className="min-h-screen bg-[#F3F4F6]">
      <NavbarUsers />
      <Headbar />
 
   
     <RiwayatHKI />

    </div>
  );
};

export default RiwayatHKIPages;
