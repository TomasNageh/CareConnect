import { MapPin, Phone, Mail, Save, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export default function ClinicInfoSection({ clinic, editingClinic, clinicForm, onFormChange, onSave, onCancelEdit, onStartEdit }) {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-gray-900">Clinic Information</h2>
        {!editingClinic && (
          <Button onClick={onStartEdit}>Edit Clinic Information</Button>
        )}
      </div>

      {editingClinic ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="clinic-name">Clinic Name *</Label>
            <Input
              id="clinic-name"
              value={clinicForm.name}
              onChange={(e) => onFormChange({ ...clinicForm, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="clinic-address">Address *</Label>
            <Input
              id="clinic-address"
              value={clinicForm.address}
              onChange={(e) => onFormChange({ ...clinicForm, address: e.target.value })}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clinic-city">City *</Label>
              <Input
                id="clinic-city"
                value={clinicForm.city}
                onChange={(e) => onFormChange({ ...clinicForm, city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="clinic-country">Country *</Label>
              <Input
                id="clinic-country"
                value={clinicForm.country}
                onChange={(e) => onFormChange({ ...clinicForm, country: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clinic-phone">Phone Number</Label>
              <Input
                id="clinic-phone"
                value={clinicForm.phoneNumber}
                onChange={(e) => onFormChange({ ...clinicForm, phoneNumber: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="clinic-email">Email</Label>
              <Input
                id="clinic-email"
                type="email"
                value={clinicForm.email}
                onChange={(e) => onFormChange({ ...clinicForm, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="clinic-location">Location Embed Code (Optional)</Label>
            <Textarea
              id="clinic-location"
              value={clinicForm.locationEmbedCode}
              onChange={(e) => onFormChange({ ...clinicForm, locationEmbedCode: e.target.value })}
              rows={3}
              placeholder="Paste Google Maps embed code here"
            />
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onSave} className="gap-2">
              <Save className="w-5 h-5" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={onCancelEdit} className="gap-2">
              <X className="w-5 h-5" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-gray-900 font-medium">{clinic.address}</p>
              <p className="text-gray-600">{clinic.city}, {clinic.country}</p>
            </div>
          </div>
          {clinic.phoneNumber && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">{clinic.phoneNumber}</span>
            </div>
          )}
          {clinic.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">{clinic.email}</span>
            </div>
          )}
          {clinic.locationEmbedCode && (
            <div className="mt-4">
              <h3 className="text-lg text-gray-900 mb-2">Location Map</h3>
              <div
                dangerouslySetInnerHTML={{ __html: clinic.locationEmbedCode }}
                className="w-full rounded-lg overflow-hidden border [&>iframe]:w-full [&>iframe]:h-64 [&>iframe]:border-0"
              />
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
