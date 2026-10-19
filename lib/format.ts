const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function money(n: number): string {
  return usd.format(n);
}
