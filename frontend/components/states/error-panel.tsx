import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export function ErrorPanel({
  title = "Something went wrong",
  description = "The page could not load the requested data.",
  onRetry
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <Panel className="border-red-200 p-6">
      <h3 className="text-lg font-semibold text-red-700">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
      {onRetry ? <Button variant="secondary" className="mt-4" onClick={onRetry}>Retry</Button> : null}
    </Panel>
  );
}
