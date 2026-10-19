import type { Metadata } from "next";
import ListingPage from "@/components/ListingPage";

export const metadata: Metadata = { title: "Men" };

export default async function MenPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string; sort?: string }>;
}) {
  const { sub, sort } = await searchParams;
  return <ListingPage category="men" title="Men" sub={sub} sort={sort} />;
}
