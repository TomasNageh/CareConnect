import { Users, UserCheck, Calendar, Building2 } from 'lucide-react';
import { Card } from '../ui/card';

export default function AdminStatsCards({ analytics }) {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl text-blue-600">{analytics?.totalUsers || 0}</p>
          </div>
          <Users className="w-12 h-12 text-blue-600" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-1">Total Doctors</p>
            <p className="text-3xl text-green-600">{analytics?.totalDoctors || 0}</p>
          </div>
          <UserCheck className="w-12 h-12 text-green-600" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-1">Total Appointments</p>
            <p className="text-3xl text-purple-600">{analytics?.totalAppointments || 0}</p>
          </div>
          <Calendar className="w-12 h-12 text-purple-600" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-1">Active Clinics</p>
            <p className="text-3xl text-orange-600">{analytics?.activeClinics || 0}</p>
          </div>
          <Building2 className="w-12 h-12 text-orange-600" />
        </div>
      </Card>
    </div>
  );
}
