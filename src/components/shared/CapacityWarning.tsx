import { AlertTriangle } from 'lucide-react';

interface Props {
  currentSchools: number;
  currentStudents: number;
  maxSchools: number;
  maxStudents: number;
}

export const CapacityWarning = ({ currentSchools, currentStudents, maxSchools, maxStudents }: Props) => {
  if (currentSchools < maxSchools && currentStudents < maxStudents) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-start gap-3 my-4">
      <AlertTriangle className="mt-0.5 shrink-0" size={20} />
      <div>
        <h4 className="font-semibold text-sm">Capacity Warning</h4>
        <p className="text-sm mt-1">
          This day already has {currentSchools} schools and {currentStudents} students booked.
          (Max: {maxSchools} schools / {maxStudents} students)
        </p>
      </div>
    </div>
  );
};
