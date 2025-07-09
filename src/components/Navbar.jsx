import { Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import LogoPoltek from "../assets/logo-poltekba.png"; // Import image

const CustomNavbar = () => {
  return (
    <Navbar fluid className="!bg-[#272C7D] shadow-md ">
      <Navbar.Brand as={Link} to="/">
        <img
          src={LogoPoltek} // Use the imported logo here
          className="mr-3 h-9 sm:h-12"
          alt="Your Logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="uppercase">
        <Link 
          to="/pengumuman" 
          className="text-white text-[16px] hover:text-gray-200 px-4 py-2"
        >
          Pengumuman
        </Link>
        <Link 
          to="/login" 
          className="text-white text-[16px] hover:text-gray-200 px-4 py-2"
        >
          Login
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
};


export default CustomNavbar;
