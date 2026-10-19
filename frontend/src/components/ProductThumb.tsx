import Image from "next/image";
import type { Category } from "@/lib/types";

const PRODUCT_IMAGES: Record<string, string> = {
  "vitamin-d3-60k": "/products/vitamin-d3-60k.png",
  "vitamin-c-chewable": "/products/vitamin-c-chewable.png",
  "multivitamin-daily": "/products/multivitamin-daily.png",
  "cough-relief-syrup": "/products/cough-relief-syrup.png",
  "digestive-syrup": "/products/digestive-syrup.png",
  "iron-folic-syrup": "/products/iron-folic-syrup.png",
  "omega-3-fish-oil": "/products/omega-3-fish-oil.png",
  "calcium-magnesium": "/products/calcium-magnesium.png",
  "protein-immunity-powder": "/products/protein-immunity-powder.png",
};

const THEME: Record<
  Category,
  { from: string; to: string; pill: string; cap: string }
> = {
  Vitamins: { from: "#FBE7C6", to: "#F6D9A6", pill: "#E8A33D", cap: "#FFF6E6" },
  Syrups: { from: "#DCE8DE", to: "#C4DBCB", pill: "#1B4332", cap: "#EAF3EC" },
  Supplements: { from: "#E9E4D2", to: "#D9D2B8", pill: "#7A6B3B", cap: "#F6F2E4" },
};

/**
 * A generated placeholder "image" for a product — a little blister pack of
 * capsules tinted by category. Purely decorative; no external asset needed.
 */
export function ProductThumb({
  category,
  handle,
  label,
  className = "",
}: {
  category: Category;
  handle?: string;
  label: string;
  className?: string;
}) {
  const t = THEME[category];
  const image = handle ? PRODUCT_IMAGES[handle] : undefined;
  const initials = label
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
    >
      {image ? (
        <Image
          src={image}
          alt={`${label} product packaging`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03] sm:p-5"
        />
      ) : (
        <>
      <svg
        viewBox="0 0 200 200"
        className="h-3/4 w-3/4 drop-shadow-sm"
        role="img"
        aria-label={`${label} placeholder`}
      >
        {/* blister tray */}
        <rect
          x="34"
          y="34"
          width="132"
          height="132"
          rx="18"
          fill={t.cap}
          opacity="0.85"
        />
        {/* capsules grid */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => {
            const cx = 60 + col * 40;
            const cy = 60 + row * 40;
            return (
              <g key={`${row}-${col}`}>
                <rect
                  x={cx - 13}
                  y={cy - 8}
                  width="26"
                  height="16"
                  rx="8"
                  fill={t.pill}
                />
                <rect
                  x={cx - 13}
                  y={cy - 8}
                  width="13"
                  height="16"
                  rx="8"
                  fill="#ffffff"
                  opacity="0.55"
                />
              </g>
            );
          })
        )}
      </svg>
      <span
        className="absolute bottom-2 right-3 font-heading text-xs font-bold tracking-wide"
        style={{ color: t.pill }}
      >
        {initials}
      </span>
        </>
      )}
    </div>
  );
}
