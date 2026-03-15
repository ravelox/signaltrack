import { Panel } from "@/components/ui/panel";

export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Panel className="p-5">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-2 text-3xl font-extrabold">{value}</div>
    </Panel>
  );
}
