// src/lib/utils/simplifyDP.ts
export default function simplify(points: number[][], epsilon = 2): number[][] {
  if (points.length < 3) return points;

  const getSqSegDist = (p: number[], p1: number[], p2: number[]) => {
    let x = p1[0], y = p1[1];
    let dx = p2[0] - x, dy = p2[1] - y;

    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) { x = p2[0]; y = p2[1]; }
      else if (t > 0) { x += dx * t; y += dy * t; }
    }

    dx = p[0] - x; dy = p[1] - y;
    return dx * dx + dy * dy;
  };

  const simplifyDP = (pts: number[][], first: number, last: number, sqEpsilon: number, out: number[][]) => {
    let maxSqDist = sqEpsilon, index = -1;
    for (let i = first + 1; i < last; i++) {
      const dist = getSqSegDist(pts[i], pts[first], pts[last]);
      if (dist > maxSqDist) { index = i; maxSqDist = dist; }
    }
    if (maxSqDist > sqEpsilon) {
      if (index - first > 1) simplifyDP(pts, first, index, sqEpsilon, out);
      out.push(pts[index]);
      if (last - index > 1) simplifyDP(pts, index, last, sqEpsilon, out);
    }
  };

  const out: number[][] = [points[0]];
  simplifyDP(points, 0, points.length - 1, epsilon * epsilon, out);
  out.push(points[points.length - 1]);
  return out;
}
