import type { Metadata } from "next";
import ListingPage from "@/components/ListingPage";

export const metadata: Metadata = { title: "Women" };

export default async function WomenPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string; sort?: string }>;
}) {
  const { sub, sort } = await searchParams;
  return <ListingPage category="women" title="Women" sub={sub} sort={sort} />;
}
