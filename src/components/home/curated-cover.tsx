import { BookOpenIcon } from "lucide-react";
import { cn } from "cn";

const themes: Record<string, { background: string; accent: string }> = {
  Fiction: {
    background:
      "bg-[linear-gradient(150deg,#173d2e_0%,#1f4d3a_55%,#2f6a50_100%)]",
    accent: "bg-[#d98e04]",
  },
  Science: {
    background:
      "bg-[linear-gradient(150deg,#15323d_0%,#1b4652_55%,#2b6674_100%)]",
    accent: "bg-[#e0b05a]",
  },
  History: {
    background:
      "bg-[linear-gradient(150deg,#4b2a1c_0%,#6d3f2a_55%,#8a573a_100%)]",
    accent: "bg-[#e6c08a]",
  },
  Kids: {
    background:
      "bg-[linear-gradient(150deg,#8a4718_0%,#a85b22_55%,#c67a35_100%)]",
    accent: "bg-[#f5d27a]",
  },
  Others: {
    background:
      "bg-[linear-gradient(150deg,#342b46_0%,#4b3a54_55%,#66506c_100%)]",
    accent: "bg-[#d9b8a6]",
  },
};

export function CuratedCover({
  title,
  author,
  category,
  className,
}: {
  title: string;
  author: string;
  category: string;
  className?: string;
}) {
  const theme = themes[category] ?? themes.Others;

  return (
    <div
      className={cn(
        "relative flex aspect-[2/3] w-full flex-col justify-between overflow-hidden rounded-xl border border-white/10 p-4 text-left shadow-soft",
        theme.background,
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1.5 bg-black/25"
      />
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1", theme.accent)} />
      <span
        aria-hidden
        className="absolute -top-10 -right-10 size-32 rounded-full border border-white/10"
      />
      <span
        aria-hidden
        className="absolute -right-14 -bottom-12 size-40 rounded-full bg-white/5"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_55%)]"
      />

      <div className="relative flex items-center justify-between text-[9px] font-semibold tracking-[0.22em] text-white/60 uppercase">
        <span>BookNook</span>
        <BookOpenIcon className="size-3.5" />
      </div>

      <div className="relative space-y-2">
        <span className="inline-flex rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-white/90 uppercase">
          {category}
        </span>
        <h3 className="font-serif text-lg leading-tight font-semibold text-white sm:text-xl">
          {title}
        </h3>
        <p className="text-[11px] text-white/70">{author}</p>
      </div>

      <div className="relative flex items-end justify-between gap-2">
        <div className="flex gap-1" aria-hidden>
          <span className={cn("h-1 w-6 rounded-full opacity-80", theme.accent)} />
          <span className={cn("h-1 w-4 rounded-full opacity-60", theme.accent)} />
          <span className={cn("h-1 w-2 rounded-full opacity-40", theme.accent)} />
        </div>
        <span className="text-[8px] tracking-[0.18em] text-white/40 uppercase">
          A staff pick
        </span>
      </div>
    </div>
  );
}
