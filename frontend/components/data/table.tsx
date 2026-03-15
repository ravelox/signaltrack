export function DataTable({
  header,
  rows
}: {
  header: React.ReactNode;
  rows: React.ReactNode;
}) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <div className="min-w-[980px]">
        {header}
        {rows}
      </div>
    </div>
  );
}
