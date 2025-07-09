import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Headbar from "../../components/HeadBar";
import NavbarUsers from "../../components/NavbarUsers";
import NewHkiForm from "../../components/users/HKI/UsulanBaruHKI";

const NewHki = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <NavbarUsers />
      <Headbar />
    <div>
        <NewHkiForm />
    </div>


    </div>
  );
};

export default NewHki;
