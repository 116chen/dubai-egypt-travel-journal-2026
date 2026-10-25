import { countries, world } from '../atlas';
import { leaderPath } from './route-path';

type Props = { selected: string; onCountry: (country: string) => void };
const highlights: Record<string, string> = { EGY: 'eg', ARE: 'eg', CHN: 'cn', NZL: 'nz', KOR: 'kr', JPN: 'jp' };
const labels: Record<string, [number, number]> = { eg: [14, 24], cn: [-35, -25], nz: [-96, -15], kr: [-90, 25], jp: [15, -15] };

export default function WorldMap({ selected, onCountry }: Props) {
  return (
    <svg viewBox="0 0 1000 430" className="atlas-world" aria-label="旅行足迹世界地图，选择国家筛选旅程" role="group">
      {world.map((country) => {
        const destination = highlights[country.code];
        return <path key={country.code} d={country.path}
          className={destination ? `world-country visited ${selected === destination ? 'selected' : ''}` : 'world-country'} />;
      })}
      {countries.filter((country) => country.id !== 'all').map((country) => {
        const x = (country.coordinate[0] + 180) / 360 * 1000;
        const y = (85 - country.coordinate[1]) / 145 * 430;
        const [dx, dy] = labels[country.id];
        return (
          <g key={country.id} transform={`translate(${x},${y})`} role="button" tabIndex={0}
            aria-label={`查看${country.name}的旅程`} aria-pressed={selected === country.id}
            onClick={() => onCountry(country.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onCountry(country.id); }
            }}
            className={`world-marker ${selected === country.id ? 'selected' : ''}`}>
            <circle r="20" fill="transparent" />
            <circle className="marker-halo" r="10" />
            <circle className="marker-core" r="3.5" />
            <path d={leaderPath({ x: 0, y: 0 }, { x: dx, y: dy })} className="marker-line" />
            <text x={dx} y={dy - 5} textAnchor={dx < 0 ? 'end' : 'start'}>{country.name}</text>
          </g>
        );
      })}
    </svg>
  );
}
