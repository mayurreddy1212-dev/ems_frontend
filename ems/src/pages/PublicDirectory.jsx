import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function PublicDirectory() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [dateTime, setDateTime] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();

    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employee/");
      setEmployees(res.data);
    } catch (error) {
      console.log("Fetch failed");
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().startsWith(search.toLowerCase()) ||
      emp.designation.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Hello
              </h1>
              <h2 className="text-3xl font-semibold text-gray-900">
                Welcome Online
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                {dateTime.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                ·{" "}
                {dateTime.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Search (STATIC) */}
          <div className="bg-white border rounded-md shadow-sm p-4">
            <input
              type="text"
              placeholder="Search employees by first letters"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Results Section (separate, fades in) */}
          {search.trim() !== "" && (
            <div className="mt-6 space-y-3 transition-all">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  className="
                    bg-white/70 backdrop-blur
                    border rounded-md px-5 py-4
                    flex items-center justify-between
                    cursor-pointer
                    transition-all duration-300
                    opacity-0 translate-y-2
                    animate-[fadeIn_0.3s_ease-out_forwards]
                    hover:bg-white
                  "
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {emp.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {emp.designation}
                    </p>
                  </div>

                  <div className="text-xs text-gray-500">
                    {emp.phone_no}
                  </div>

                  <div>
                    {emp.is_active ? (
                      <span className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1 rounded-full bg-gray-300 text-gray-700">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filteredEmployees.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-6">
                  No employees found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default PublicDirectory;
