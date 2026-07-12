import { Card } from '../ui/card';
import { Button } from '../ui/button';

export default function AdminPendingTab({ pendingDoctors, pendingClinics, onVerifyDoctor, onVerifyClinic }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl text-gray-900 mb-4">Pending Doctors ({pendingDoctors.length})</h3>
        {pendingDoctors.length > 0 ? (
          <div className="space-y-4">
            {pendingDoctors.map((doctor) => (
              <Card key={doctor.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg text-gray-900 mb-2">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h4>
                    <p className="text-gray-600 mb-1">Specialty: {doctor.specialty}</p>
                    <p className="text-gray-600 mb-1">License: {doctor.licenseNumber}</p>
                    <p className="text-sm text-gray-500">Email: {doctor.email}</p>
                  </div>
                  <Button onClick={() => onVerifyDoctor(doctor.id)}>Verify Doctor</Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No pending doctor verifications</p>
          </Card>
        )}
      </div>

      <div>
        <h3 className="text-xl text-gray-900 mb-4">Pending Clinics ({pendingClinics.length})</h3>
        {pendingClinics.length > 0 ? (
          <div className="space-y-4">
            {pendingClinics.map((clinic) => (
              <Card key={clinic.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg text-gray-900 mb-2">{clinic.name}</h4>
                    <p className="text-gray-600 mb-1">Doctor: {clinic.doctorName}</p>
                    <p className="text-gray-600 mb-1">{clinic.address}, {clinic.city}</p>
                  </div>
                  <Button onClick={() => onVerifyClinic(clinic.id)}>Verify Clinic</Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No pending clinic verifications</p>
          </Card>
        )}
      </div>
    </div>
  );
}
