import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorList = async () => {
      try {
        const res = await axios.get(BASE_URL + "/doctor/list");
        const doctors = res.data.doctors;

        if (!doctors || doctors.length === 0) {
          setError("No accepted doctors found.");
          return;
        }

        setDoctor(doctors[0]); // Display first accepted doctor
      } catch (err) {
        setError("Failed to load doctors.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorList();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-500">
        Loading doctor profile...
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-red-600">
        {error || "Doctor not found."}
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-blue-100 to-white">
      <div className="max-w-3xl p-8 mx-auto bg-white shadow-xl rounded-2xl">
        <div className="flex flex-col items-center mb-6 text-center">
          {doctor.photoUrl ? (
            <img
              src={doctor.photoUrl}
              alt="Doctor"
              className="object-cover w-32 h-32 mb-4 border-4 border-blue-400 rounded-full shadow-md"
            />
          ) : (
            <div className="flex items-center justify-center w-32 h-32 mb-4 text-xl font-bold text-white bg-gray-400 rounded-full">
              No Photo
            </div>
          )}
          <h2 className="mb-1 text-3xl font-bold text-blue-800">
            Dr. {doctor.firstName}
          </h2>
          <p className="text-lg italic text-gray-600">
            {doctor.speciality || "General Physician"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6 text-gray-700 sm:grid-cols-2">
          <Info label="Email" value={doctor.emailId} />
          <Info label="Phone" value={doctor.phone} />
          <Info label="Experience" value={`${doctor.experienceYears} years`} />
          <Info label="Clinic Address" value={doctor.clinicAddress} />
          <Info label="Available From" value={doctor.availableFrom} />
          <Info label="Available To" value={doctor.availableTo} />
          <Info label="Status" value={doctor.status} />
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="font-semibold">{label}:</p>
    <p>{value || "N/A"}</p>
  </div>
);

export default DoctorProfile;
