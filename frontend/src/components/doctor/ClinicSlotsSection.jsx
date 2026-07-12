import { Clock, Edit, Plus, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export default function ClinicSlotsSection({ slots, onAddSlot, onEditSlot, onDeleteSlot, onToggleSlot }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-gray-900">Time Slots</h2>
        <Button onClick={() => onAddSlot()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Slot
        </Button>
      </div>

      {slots.length > 0 ? (
        <div className="space-y-3">
          {slots.map((slot) => (
            <div
              key={slot.slotId}
              className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${
                slot.disabled ? 'opacity-50 bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-4 h-4" />
                <span className="font-medium">
                  {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                </span>
                {slot.disabled && (
                  <Badge variant="outline" className="ml-2 text-red-600">
                    Disabled
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onToggleSlot(slot)}>
                  {slot.disabled ? 'Enable' : 'Disable'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEditSlot(slot)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDeleteSlot(slot.slotId)} disabled={slot.disabled}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600">
          <p>No time slots set. Add slots to allow patients to book appointments.</p>
          <Button variant="outline" className="mt-4" onClick={() => onAddSlot()}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Slot
          </Button>
        </div>
      )}
    </Card>
  );
}
