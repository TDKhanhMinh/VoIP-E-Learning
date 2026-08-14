export function parseDurationInMilliseconds(value: string): number {
  const match = /^(\d+)([smhd])$/u.exec(value);
  if (!match) throw new Error('Duration must use s, m, h or d units');
  const multiplier = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[
    match[2] as 's' | 'm' | 'h' | 'd'
  ];
  return Number(match[1]) * multiplier;
}
