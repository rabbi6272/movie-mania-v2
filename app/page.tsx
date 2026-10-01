import { HomeClient } from "@/components/home/HomeClient";
import { TrendingRow } from "@/components/home/TrendingRow";

export default function HomePage() {
  return <HomeClient trending={<TrendingRow />} />;
}
