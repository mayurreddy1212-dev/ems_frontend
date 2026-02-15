import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [showEmailModal, setShowEmailModal] = useState(false);

  const [emailData, setEmailData] = useState({
    subject: "",
    instruction: "",
  });

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

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token/");

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
    } catch {
      showMessage("Failed to fetch employees");
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

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        salary: Number(formData.salary),
      };

      if (isEditing && selectedId) {
        await API.put(`/employee/${selectedId}`, payload);
        showMessage("Employee updated successfully");
      } else {
        await API.post("/employee/", payload);
        showMessage("Employee created successfully");
      }

      setShowForm(false);
      resetForm();
      fetchEmployees();
    } catch (error) {
      showMessage(error.response?.data?.detail || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setFormData(emp);
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
      showMessage("Employee deleted successfully");
      setSelectedEmployees((prev) => prev.filter((empId) => empId !== id));
      fetchEmployees();
    } catch (error) {
      showMessage(error.response?.data?.detail || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id)
        ? prev.filter((empId) => empId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEmployees(employees.map((emp) => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSendSelectedEmail = async () => {
    if (!emailData.subject || !emailData.instruction) {
      showMessage("Subject and instruction are required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/employee/send-email", {
        subject: emailData.subject,
        instruction: emailData.instruction,
        employee_ids: selectedEmployees,
      });

      showMessage("Emails are being sent");

      setShowEmailModal(false);
      setEmailData({ subject: "", instruction: "" });
      setSelectedEmployees([]);
    } catch (error) {
      showMessage(error.response?.data?.detail || "Email sending failed.");
    } finally {
      setLoading(false);
    }
  };

  const isAllSelected =
    employees.length > 0 &&
    selectedEmployees.length === employees.length;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">

        {message && (
          <div className="fixed top-5 right-5 bg-gray-900 text-white px-6 py-3 rounded shadow-lg z-50">
            {message}
          </div>
        )}

        {/* ADD / EDIT MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-lg">
              <h2 className="text-xl font-bold">
                {isEditing ? "Edit Employee" : "Add Employee"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="phone_no" placeholder="Phone" value={formData.phone_no} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />

                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                  Active
                </label>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">
                    Cancel
                  </button>
                  <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                    {isEditing ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Hello</h1>
          <p className="text-gray-600">Welcome back</p>
          <div className="mt-2 text-sm text-gray-500">
            {dateTime.toLocaleString("en-IN")}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Employee Dashboard</h2>

          <div className="flex gap-3">
            <button
              disabled={selectedEmployees.length === 0}
              onClick={() => setShowEmailModal(true)}
              className={`px-4 py-2 rounded ${
                selectedEmployees.length === 0
                  ? "bg-gray-500 text-white"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Send Email ({selectedEmployees.length})
            </button>

            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Add Employee
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">
                  <input type="checkbox" onChange={handleSelectAll} checked={isAllSelected} />
                </th>
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
              {employees.map((emp) => (
                <tr key={emp.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => handleCheckboxChange(emp.id)}
                    />
                  </td>
                  <td className="p-3">{emp.id}</td>
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.designation}</td>
                  <td className="p-3">₹{emp.salary}</td>
                  <td className="p-3">{emp.phone_no}</td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.is_active ? "Yes" : "No"}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEdit(emp)} className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(emp.id)} className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMAIL MODAL */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-lg">
              <h2 className="text-xl font-bold">
                Send Email to {selectedEmployees.length} Employee(s)
              </h2>

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={emailData.subject}
                onChange={handleEmailChange}
                className="w-full p-2 border rounded"
              />

              <textarea
                name="instruction"
                placeholder="Email instruction for AI..."
                value={emailData.instruction}
                onChange={handleEmailChange}
                className="w-full p-2 border rounded"
                rows="4"
              />

              <div className="flex justify-end gap-3">
                <button onClick={() => setShowEmailModal(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button onClick={handleSendSelectedEmail} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
