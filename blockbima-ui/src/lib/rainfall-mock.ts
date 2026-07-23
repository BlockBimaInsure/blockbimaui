import { DailyRainfall } from "./api-client";

function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return () => {
    hash = (hash * 1664525 + 1013904223) | 0;
    return (hash >>> 0) / 4294967296;
  };
}

export async function getRainfallFeed(
  contractId: string,
  startDate: string,
  endDate: string
): Promise<DailyRainfall[]> {
  const readings: DailyRainfall[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) return readings;

  const rng = seededRandom(contractId);

  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    const rand = rng();
    let amount: number;

    if (rand < 0.18) {
      amount = 10 + rng() * 15;
    } else if (rand < 0.5) {
      amount = rng() * 8;
    } else {
      amount = 0;
    }

    readings.push({
      date: dateStr,
      amountMm: Math.round(amount * 10) / 10,
    });

    current.setDate(current.getDate() + 1);
  }

  return readings;
}
