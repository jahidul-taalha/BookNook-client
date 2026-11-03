import { Spinner } from "@/components/ui/spinner";
import { cn } from "cn";

export function FullPageLoader({
  label = "Opening your library card…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
        <Spinner className="size-6" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
