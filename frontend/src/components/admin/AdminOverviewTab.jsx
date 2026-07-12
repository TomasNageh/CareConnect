import { AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export default function AdminOverviewTab({ analytics, pendingDoctors, pendingClinics }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Pending Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium">Pending Doctors</p>
                <p className="text-sm text-gray-600">{pendingDoctors.length} doctors awaiting verification</p>
              </div>
              <Badge className="bg-orange-500">{pendingDoctors.length}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium">Pending Clinics</p>
                <p className="text-sm text-gray-600">{pendingClinics.length} clinics awaiting verification</p>
              </div>
              <Badge className="bg-orange-500">{pendingClinics.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Users</span>
              <span className="text-2xl font-bold text-blue-600">{analytics?.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Doctors</span>
              <span className="text-2xl font-bold text-green-600">{analytics?.totalDoctors || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Appointments</span>
              <span className="text-2xl font-bold text-purple-600">{analytics?.totalAppointments || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Clinics</span>
              <span className="text-2xl font-bold text-orange-600">{analytics?.activeClinics || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
