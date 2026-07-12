import { Search, Filter, Eye, Ban, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import * as adminAPI from '../../services/admin';
import { toast } from 'sonner';

export default function AdminUsersTab({
  users,
  totalUsers,
  userFilter,
  userSearch,
  currentPage,
  onFilterChange,
  onSearchChange,
  onPageChange,
  onDeactivateUser,
  onActivateUser,
}) {
  const filteredUsers = users.filter((u) => {
    if (!userSearch) return true;
    const searchLower = userSearch.toLowerCase();
    return (
      (u.firstName || '').toLowerCase().includes(searchLower) ||
      (u.lastName || '').toLowerCase().includes(searchLower) ||
      (u.email || '').toLowerCase().includes(searchLower) ||
      (u.username || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users by name, email, or username..."
              value={userSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={userFilter} onValueChange={onFilterChange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Patient">Patients</SelectItem>
              <SelectItem value="Doctor">Doctors</SelectItem>
              <SelectItem value="Admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {totalUsers} users
        </div>
      </div>

      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <Card key={u.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg text-gray-900">
                      {u.firstName || ''} {u.lastName || ''} {u.firstName || u.lastName ? '' : u.username}
                    </h4>
                    <Badge variant="outline">{u.role}</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span> {u.email}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Username:</span> {u.username}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Created:</span> {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Status:</span>
                      <Badge className={`ml-2 ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {u.isActive ? (
                    <Button size="sm" variant="outline" onClick={() => onDeactivateUser(u.id)} className="gap-2">
                      <Ban className="w-4 h-4" />
                      Deactivate
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => onActivateUser(u.id)} className="gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Activate
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      adminAPI.getUser(u.id).then((userData) => {
                        toast.info(`User ID: ${userData.id}, Role: ${userData.role}`);
                      });
                    }}
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No users found</p>
          </Card>
        )}
      </div>

      {totalUsers > 20 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button variant="outline" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(totalUsers / 20)}
          </span>
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= Math.ceil(totalUsers / 20)}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
