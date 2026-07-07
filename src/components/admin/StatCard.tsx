import AdminCard from "./AdminCard";

export default function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <AdminCard glow={accent}>
      <p className="font-adminSans text-sm text-white/50">{label}</p>
      <p
        className={`mt-2 font-adminSans text-3xl font-semibold ${
          accent ? "text-adminAccent-soft" : "text-white"
        }`}
      >
        {value}
      </p>
    </AdminCard>
  );
}
