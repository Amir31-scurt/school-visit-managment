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
    <div
      role="alert"
      className="bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-3 rounded-[var(--radius-sm)] flex items-start gap-3"
    >
      <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={18} aria-hidden="true" />
      <div className="text-xs sm:text-sm leading-relaxed">
        <p className="font-semibold">Capacity threshold reached</p>
        <p className="text-amber-800 mt-0.5">
          {currentSchools}/{maxSchools} schools · {currentStudents}/{maxStudents} students already booked for this day.
        </p>
      </div>
    </div>
  );
};
