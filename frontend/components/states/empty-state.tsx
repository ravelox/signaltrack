import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export function EmptyState({
  title,
  description,
  actionLabel
}: {
  title: string;
  description: string;
  actionLabel?: string;
}) {
  return (
    <Panel className="p-8 text-center">
      <div className="mx-auto max-w-xl">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted">{description}</p>
        {actionLabel ? <Button className="mt-4">{actionLabel}</Button> : null}
      </div>
    </Panel>
  );
}
