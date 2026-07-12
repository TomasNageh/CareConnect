import { Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function SlotDialog({ open, onOpenChange, editingSlot, slotForm, onFormChange, onSave }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingSlot ? 'Edit Time Slot' : 'Add Time Slot'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Add a time slot that patients can book for any day. For example, 09:00 - 09:30.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-time">Start Time *</Label>
              <Input
                id="start-time"
                type="time"
                value={slotForm.startTime}
                onChange={(e) => onFormChange({ ...slotForm, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="end-time">End Time *</Label>
              <Input
                id="end-time"
                type="time"
                value={slotForm.endTime}
                onChange={(e) => onFormChange({ ...slotForm, endTime: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              <Save className="w-4 h-4 mr-2" />
              {editingSlot ? 'Update' : 'Add'} Slot
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
