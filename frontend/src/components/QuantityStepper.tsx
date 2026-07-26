"use client";

export function QuantityStepper({
  qty,
  onChange,
  min = 1,
}: {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-primary/20 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, qty - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-primary transition-colors hover:bg-sage disabled:opacity-40"
        disabled={qty <= min}
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(qty + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-primary transition-colors hover:bg-sage"
      >
        +
      </button>
    </div>
  );
}
