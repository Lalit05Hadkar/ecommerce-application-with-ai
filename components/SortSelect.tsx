"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SortOption } from "@/lib/api";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export default function SortSelect({ current }: { current: SortOption }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") params.delete("sort");
    else params.set("sort", value);
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?");
  };

  return (
    <label className="sort-select">
      Sort by
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort products"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
