import atlasJson from './data/atlas.json';
import chinaJson from './data/china.json';
import indonesiaJson from './data/indonesia.json';
import worldJson from './data/world.json';
import yunnanJson from './data/yunnan.json';
import { journal, photoById, type Photo } from './data';

export type AtlasPhoto = Photo & { placeId: string; location: number[] | null; evidence: string };
export type AtlasPlace = {
  id: string;
  name: string;
  description: string;
  coordinates: number[];
  photoIds: string[];
};
export type AtlasTrip = {
  id: string;
  country: string;
  countryCode: string;
  english: string;
  title: string;
  subtitle: string;
  start: string;
  end: string;
  days: number;
  coverId: string;
  secondaryId: string;
  tags: string[];
  places: AtlasPlace[];
  photos: AtlasPhoto[];
  map: { paths: string[]; points: { id: string; x: number; y: number }[]; note?: string };
};
export type TripCard = Omit<AtlasTrip, 'map' | 'places' | 'photos'> & { photos: Photo[] };
const sourceAtlas = atlasJson as unknown as { trips: AtlasTrip[] };
const arrivalIds = new Set(['japan-summer-001', 'japan-summer-007', 'japan-summer-008']);
export const atlas = {
  trips: [
    ...sourceAtlas.trips,
    ...chinaJson.trips as unknown as AtlasTrip[],
    ...indonesiaJson.trips as unknown as AtlasTrip[],
    ...yunnanJson.trips as unknown as AtlasTrip[],
  ].map((trip): AtlasTrip => {
    if (trip.id !== 'japan-summer') return trip;
    // IMG_7048/7049 GPS: 34.4302 N, 135.2386 E (Kansai Airport).
    // Keep the source snapshot; correct the earlier nearest-city grouping here.
    return {
      ...trip,
      places: [
        { id: 'arrival', name: '关西机场', description: '飞机、舷窗与机场的傍晚，记录抵达关西的第一天。', coordinates: [34.43023, 135.238625], photoIds: [...arrivalIds] },
        ...trip.places.map((place) => place.id === 'kobe' ? { ...place, photoIds: place.photoIds.filter((id) => !arrivalIds.has(id)) } : place),
      ],
      photos: trip.photos.map((photo) => arrivalIds.has(photo.id) ? {
        ...photo, placeId: 'arrival', place: '关西机场',
        evidence: photo.id === 'japan-summer-001' ? 'nearby-airport-captures-and-visual-review' : 'gps-at-kansai-airport-and-visual-review',
      } : photo),
      map: { ...trip.map, points: [{ id: 'arrival', x: 316.2, y: 429.2 }, ...trip.map.points] },
    };
  }),
};
export const world = worldJson as { name: string; code: string; path: string }[];
const unsortedTrips: TripCard[] = [
  {
    id: 'egypt-dubai', country: '埃及 · 阿联酋', countryCode: 'eg', english: 'EGYPT & DUBAI',
    title: '从尼罗河，到另一片海。',
    subtitle: '神庙、沙漠与红海，最后走进迪拜的天际线。',
    start: '2026-09-30', end: '2026-10-11', days: 12,
    coverId: 'p-0478', secondaryId: 'p-0578',
    tags: ['古文明', '红海', '城市'], photos: journal.photos,
  },
  ...atlas.trips,
];
export const trips = [...unsortedTrips].sort(
  (left, right) =>
    right.start.localeCompare(left.start) ||
    right.end.localeCompare(left.end) ||
    left.id.localeCompare(right.id),
);
export const allPhotos = new Map<string, Photo>([
  ...photoById,
  ...atlas.trips.flatMap((trip) => trip.photos.map((photo) => [photo.id, photo] as const)),
]);
export const totalPhotos = trips.reduce((total, trip) => total + trip.photos.length, 0);
export const totalDays = trips.reduce((total, trip) => total + trip.days, 0);
export const totalCountries = new Set(trips.flatMap((trip) => trip.countryCode === 'eg' ? ['eg', 'ae'] : [trip.countryCode])).size;
export const yearRange = `${Math.min(...trips.map((trip) => Number(trip.start.slice(0, 4))))}—${Math.max(...trips.map((trip) => Number(trip.end.slice(0, 4))))}`;
export const tripValues = ['all', ...trips.map((trip) => trip.id)];
export const countries = [
  { id: 'all', name: '全部旅程', english: 'ALL', coordinate: [0, 0] },
  { id: 'eg', name: '埃及与迪拜', english: 'EGYPT & DUBAI', coordinate: [31, 29] },
  { id: 'cn', name: '中国', english: 'CHINA', coordinate: [103, 39] },
  { id: 'id', name: '印度尼西亚', english: 'INDONESIA', coordinate: [106.8, -6.2] },
  { id: 'nz', name: '新西兰', english: 'NEW ZEALAND', coordinate: [171, -42] },
  { id: 'kr', name: '韩国', english: 'SOUTH KOREA', coordinate: [126.5, 33.4] },
  { id: 'jp', name: '日本', english: 'JAPAN', coordinate: [138, 36] },
];
export const countryValues = countries.map((country) => country.id);
export function dateRange(start: string, end: string) {
  return `${start.replaceAll('-', '.')} — ${end.slice(5).replace('-', '.')}`;
}
