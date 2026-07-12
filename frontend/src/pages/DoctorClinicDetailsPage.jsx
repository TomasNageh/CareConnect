import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import * as doctorAPI from '../services/doctor';
import { toast } from 'sonner';
import ClinicInfoSection from '../components/doctor/ClinicInfoSection';
import ClinicSlotsSection from '../components/doctor/ClinicSlotsSection';
import SlotDialog from '../components/doctor/SlotDialog';

export default function DoctorClinicDetailsPage() {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clinic, setClinic] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClinic, setEditingClinic] = useState(false);
  const [slotDialogOpen, setSlotDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  const [clinicForm, setClinicForm] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    phoneNumber: '',
    email: '',
    locationEmbedCode: '',
  });

  const [slotForm, setSlotForm] = useState({
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    if (clinicId && user) {
      loadClinicData();
    }
  }, [clinicId, user]);

  const loadClinicData = async () => {
    try {
      setLoading(true);
      const [clinicData, slotsData] = await Promise.all([
        doctorAPI.getClinic(parseInt(clinicId)),
        doctorAPI.getSlots(parseInt(clinicId)),
      ]);
      setClinic(clinicData);
      setSlots(slotsData || []);
      setClinicForm({
        name: clinicData.name || '',
        address: clinicData.address || '',
        city: clinicData.city || '',
        country: clinicData.country || '',
        phoneNumber: clinicData.phoneNumber || '',
        email: clinicData.email || '',
        locationEmbedCode: clinicData.locationEmbedCode || '',
      });
    } catch (error) {
      console.error('Error loading clinic:', error);
      toast.error('Failed to load clinic information');
      navigate('/dashboard/doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClinic = async () => {
    try {
      await doctorAPI.updateClinic(parseInt(clinicId), clinicForm);
      toast.success('Clinic updated successfully');
      setEditingClinic(false);
      loadClinicData();
    } catch (error) {
      console.error('Error updating clinic:', error);
      toast.error(error.response?.data?.message || 'Failed to update clinic');
    }
  };

  const handleOpenSlotDialog = (slot = null) => {
    if (slot) {
      setEditingSlot(slot);
      setSlotForm({
        startTime: slot.startTime.substring(0, 5),
        endTime: slot.endTime.substring(0, 5),
      });
    } else {
      setEditingSlot(null);
      setSlotForm({ startTime: '', endTime: '' });
    }
    setSlotDialogOpen(true);
  };

  const handleSaveSlot = async () => {
    if (!slotForm.startTime || !slotForm.endTime) {
      toast.error('Please provide both start and end time');
      return;
    }

    const slotData = {
      startTime: slotForm.startTime.length === 5 ? `${slotForm.startTime}:00` : slotForm.startTime,
      endTime: slotForm.endTime.length === 5 ? `${slotForm.endTime}:00` : slotForm.endTime,
    };

    try {
      if (editingSlot) {
        await doctorAPI.updateSlot(parseInt(clinicId), editingSlot.slotId, slotData);
        toast.success('Slot updated successfully');
      } else {
        await doctorAPI.addSlot(parseInt(clinicId), slotData);
        toast.success('Slot added successfully');
      }
      setSlotDialogOpen(false);
      loadClinicData();
    } catch (error) {
      console.error('Error saving slot:', error);
      toast.error(error.response?.data?.message || 'Failed to save slot');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    try {
      await doctorAPI.deleteSlot(parseInt(clinicId), slotId);
      toast.success('Slot deleted successfully');
      loadClinicData();
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast.error(error.response?.data?.message || 'Failed to delete slot');
    }
  };

  const handleToggleSlot = async (slot) => {
    try {
      await doctorAPI.updateSlot(parseInt(clinicId), slot.slotId, { disabled: !slot.disabled });
      toast.success(`Slot ${slot.disabled ? 'enabled' : 'disabled'} successfully`);
      loadClinicData();
    } catch (error) {
      console.error('Error toggling slot:', error);
      toast.error(error.response?.data?.message || 'Failed to update slot');
    }
  };

  const handleCancelEdit = () => {
    setEditingClinic(false);
    setClinicForm({
      name: clinic.name || '',
      address: clinic.address || '',
      city: clinic.city || '',
      country: clinic.country || '',
      phoneNumber: clinic.phoneNumber || '',
      email: clinic.email || '',
      locationEmbedCode: clinic.locationEmbedCode || '',
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading clinic details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">Clinic not found</p>
            <Button onClick={() => navigate('/dashboard/doctor')}>Back to Dashboard</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard/doctor')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{clinic.name}</h1>
            <div className="flex items-center gap-4">
              {clinic.isVerified && <Badge className="bg-green-500">Verified</Badge>}
              <Badge variant="outline">{clinic.isVerified ? 'Active' : 'Pending Verification'}</Badge>
            </div>
          </div>
        </div>

        <ClinicInfoSection
          clinic={clinic}
          editingClinic={editingClinic}
          clinicForm={clinicForm}
          onFormChange={setClinicForm}
          onSave={handleSaveClinic}
          onCancelEdit={handleCancelEdit}
          onStartEdit={() => setEditingClinic(true)}
        />

        <ClinicSlotsSection
          slots={slots}
          onAddSlot={handleOpenSlotDialog}
          onEditSlot={handleOpenSlotDialog}
          onDeleteSlot={handleDeleteSlot}
          onToggleSlot={handleToggleSlot}
        />
      </div>

      <SlotDialog
        open={slotDialogOpen}
        onOpenChange={setSlotDialogOpen}
        editingSlot={editingSlot}
        slotForm={slotForm}
        onFormChange={setSlotForm}
        onSave={handleSaveSlot}
      />
    </div>
  );
}
