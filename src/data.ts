import journalData from './data/journal.json';
import mapJson from './data/map.json';
import contentJson from './data/content.json';

export type Photo = (typeof journalData.photos)[number];
export type Chapter = (typeof contentJson.chapters)[number];
export type Reading = (typeof contentJson.readings)[number];
export type Day = (typeof contentJson.days)[number];
export type Story = (typeof journalData.stories)[number];
export type Place = (typeof mapJson.locations)[number];
export type MapView = (typeof mapJson.views)[number];
export type RichSegment = Reading['paragraphs'][number][number];
export const journal = journalData;
export const mapData = mapJson;
export const content = contentJson;
export const photoById = new Map(journal.photos.map((photo) => [photo.id, photo]));
export const placeById = new Map(mapData.locations.map((place) => [place.id, place]));
export const readingById = new Map(content.readings.map((reading) => [reading.id, reading]));
export const chapterById = new Map(content.chapters.map((chapter) => [chapter.id, chapter]));

export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export function photosFor(ids: string[]) {
  return ids.map((id) => photoById.get(id)).filter((photo): photo is Photo => Boolean(photo));
}

export function countryLabel(photo: Photo) {
  return photo.country === '迪拜' ? '阿联酋' : photo.country;
}

const dateFormat = new Intl.DateTimeFormat('zh-CN', {
  month: '2-digit', day: '2-digit', timeZone: 'UTC',
});
export function shortDate(date: string) {
  return dateFormat.format(new Date(`${date}T00:00:00Z`)).replace('/', '.');
}
