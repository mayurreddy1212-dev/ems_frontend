import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [dateTime, setDateTime] = useState(new Date());

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    salary: "",
    phone_no: "",
    address: "",
    email: "",
    is_active: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    } else {
      fetchEmployees();
    }

    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await API.get("/employee/");
      setEmployees(response.data);
    } catch (error) {
      alert("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      salary: "",
      phone_no: "",
      address: "",
      email: "",
      is_active: true,
    });
    setIsEditing(false);
    setSelectedId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        salary: Number(formData.salary),
      };

      if (isEditing) {
        await API.put(`/employee/${selectedId}`, payload);
        alert("Employee updated successfully");
      } else {
        await API.post("/employee/", payload);
        alert("Employee created successfully");
      }

      setShowForm(false);
      resetForm();
      fetchEmployees();
    } catch (error) {
      alert(
        error.response?.data?.detail || "Operation failed. Check inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setFormData({
      name: emp.name,
      designation: emp.designation,
      salary: emp.salary,
      phone_no: emp.phone_no,
      address: emp.address,
      email: emp.email,
      is_active: emp.is_active,
    });

    setSelectedId(emp.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      setLoading(true);
      await API.delete(`/employee/${id}`);
      fetchEmployees();
    } catch (error) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">
            Hello
          </h1>
          <p className="text-gray-600">
            Welcome back to MR Developers Dashboard
          </p>

          <div className="mt-2 text-sm text-gray-500">
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
              second: "2-digit",
            })}
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            Employee Dashboard
          </h2>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Employee
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Salary</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Active</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-5 text-center">
                    Loading...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-5 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{emp.id}</td>
                    <td className="p-3">{emp.name}</td>
                    <td className="p-3">{emp.designation}</td>
                    <td className="p-3">₹{emp.salary}</td>
                    <td className="p-3">{emp.phone_no}</td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3">
                      {emp.is_active ? (
                        <span className="text-green-600 font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          No
                        </span>
                      )}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-lg"
            >
              <h2 className="text-xl font-bold">
                {isEditing ? "Update Employee" : "Add Employee"}
              </h2>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="text"
                name="phone_no"
                placeholder="Phone"
                value={formData.phone_no}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                Active
              </label>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isEditing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
