import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { ClipboardList, Stethoscope, FileText } from "lucide-react";

const DoctorDiagnosisForm = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    appointmentId: "",
    diagnosis: "",
    prescription: "",
  });
  const [message, setMessage] = useState("");

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await axios.get(
        BASE_URL + "/appointments/appointments-list",
        {
          withCredentials: true,
        }
      );

      const pending = res.data.data.filter(
        (a) => a.status === "accepted" && (!a.diagnosis || !a.prescription)
      );

      setAppointments(pending);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(BASE_URL + "/appointments/submitdiagnosis", formData, {
        withCredentials: true,
      });

      setMessage("✅ Diagnosis submitted successfully!");
      setFormData({ appointmentId: "", diagnosis: "", prescription: "" });
      fetchAppointments();
    } catch (err) {
      console.error("Submission error:", err);
      setMessage("❌ Submission failed. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl px-6 py-10 mx-auto mt-10 shadow-lg bg-gradient-to-br from-white via-blue-50 to-white rounded-xl">
      <div className="flex items-center justify-center mb-6 text-blue-700">
        <Stethoscope className="w-8 h-8 mr-2" />
        <h2 className="text-3xl font-bold">Diagnosis & Prescription</h2>
      </div>

      {message && (
        <p
          className={`mb-6 text-center text-sm font-semibold ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            <ClipboardList className="inline w-4 h-4 mr-1 text-blue-600" />
            Select Appointment
          </label>
          <select
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            name="appointmentId"
            value={formData.appointmentId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Appointment --</option>
            {appointments.map((appt) => (
              <option key={appt._id} value={appt._id}>
                {appt.name || appt.patient?.name || "Unnamed Patient"} —{" "}
                {new Date(appt.appointmentDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            <FileText className="inline w-4 h-4 mr-1 text-blue-600" />
            Diagnosis
          </label>
          <textarea
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            placeholder="Enter your diagnosis here..."
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            <FileText className="inline w-4 h-4 mr-1 text-blue-600" />
            Prescription
          </label>
          <textarea
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            name="prescription"
            value={formData.prescription}
            onChange={handleChange}
            placeholder="Enter the prescription..."
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full px-5 py-2 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
          >
            Submit Diagnosis
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorDiagnosisForm;
