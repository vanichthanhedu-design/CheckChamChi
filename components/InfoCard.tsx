interface Props {
  icon: string;
  label: string;
  value: string;
}

export default function InfoCard({ icon, label, value }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 flex items-center gap-4 h-full">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}