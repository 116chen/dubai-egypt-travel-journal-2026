type Point = { x: number; y: number };

export function routePath(points: Point[]) {
  if (!points.length) return '';
  let path = `M${points[0].x},${points[0].y}`;
  for (let index = 0; index < points.length - 1; index++) {
    const start = points[index];
    const end = points[index + 1];
    const previous = points[index - 1] ?? start;
    const next = points[index + 2] ?? end;
    const handle = Math.hypot(end.x - start.x, end.y - start.y) * .18;
    const incoming = Math.hypot(end.x - previous.x, end.y - previous.y) || 1;
    const outgoing = Math.hypot(next.x - start.x, next.y - start.y) || 1;
    const first = {
      x: start.x + (end.x - previous.x) / incoming * handle,
      y: start.y + (end.y - previous.y) / incoming * handle,
    };
    const second = {
      x: end.x - (next.x - start.x) / outgoing * handle,
      y: end.y - (next.y - start.y) / outgoing * handle,
    };
    path += `C${first.x.toFixed(2)},${first.y.toFixed(2)} ${second.x.toFixed(2)},${second.y.toFixed(2)} ${end.x},${end.y}`;
  }
  return path;
}

export function leaderPath(start: Point, end: Point) {
  const length = Math.hypot(end.x - start.x, end.y - start.y) || 1;
  const bend = Math.min(8, length * .1);
  const x = (start.x + end.x) / 2 - (end.y - start.y) / length * bend;
  const y = (start.y + end.y) / 2 + (end.x - start.x) / length * bend;
  return `M${start.x},${start.y}Q${x.toFixed(2)},${y.toFixed(2)} ${end.x},${end.y}`;
}

export function curvedMapPath(path: string) {
  if (!/^M[\d.,\sML-]+$/.test(path)) return path;
  const points = [...path.matchAll(/[ML](-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)]
    .map((match) => ({ x: Number(match[1]), y: Number(match[2]) }));
  return points.length > 1 ? routePath(points) : path;
}
