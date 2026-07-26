import type { Category } from "@/lib/types";

/**
 * A capsule-style category tag — fully rounded "pill", part of the blister
 * pack visual language.
 */
export function CategoryPill({
  category,
  size = "sm",
}: {
  category: Category;
  size?: "sm" | "md";
}) {
  const sizes =
    size === "md" ? "px-4 py-1.5 text-sm" : "px-3 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizes} border-primary/15 bg-sage text-primary`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {category}
    </span>
  );
}
