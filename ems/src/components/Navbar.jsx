import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-extrabold cursor-pointer text-black tracking-tight"
      >
        EMS
      </h1>

      <div className="flex gap-6 items-center">
        {/* Public Page */}
        {!token && location.pathname === "/" && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Admin Login
          </button>
        )}

        {/* Dashboard */}
        {token && (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-700 hover:text-black transition font-medium"
            >
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
