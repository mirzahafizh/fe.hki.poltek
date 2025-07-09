import { useState } from "react";
import Headbar from "../../components/HeadBar";
import NavbarUsers from "../../components/NavbarUsers";
import RiwayatPaten from "../../components/users/Patent/riwayatPaten";

const Riwayat = () => {
  const [filter, setFilter] = useState("Semua");


  const handleFilter = (kategori) => {
    setFilter(kategori);
  };

  return (
        <div className="min-h-screen bg-[#F3F4F6]">
      <NavbarUsers />
      <Headbar />
 
    
      <RiwayatPaten />

    </div>
  );
};

export default Riwayat;
