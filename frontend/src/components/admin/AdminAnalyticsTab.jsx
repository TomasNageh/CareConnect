import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export default function AdminAnalyticsTab({ analytics }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Total Users</span>
              <span className="text-2xl font-bold text-blue-600">{analytics?.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Total Patients</span>
              <span className="text-2xl font-bold text-green-600">{analytics?.totalPatients || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700">Total Doctors</span>
              <span className="text-2xl font-bold text-purple-600">{analytics?.totalDoctors || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700">Total Appointments</span>
              <span className="text-2xl font-bold text-orange-600">{analytics?.totalAppointments || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
              <span className="text-gray-700">Active Clinics</span>
              <span className="text-2xl font-bold text-teal-600">{analytics?.activeClinics || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Specialties</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics?.popularSpecialties?.length > 0 ? (
            <div className="space-y-3">
              {analytics.popularSpecialties.map((spec, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{spec.specialty}</span>
                  <Badge className="bg-blue-500">{spec.count} doctors</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
