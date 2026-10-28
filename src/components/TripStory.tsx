import { ArrowDown, ArrowUpRight, BookOpen, Camera, MapPin } from 'lucide-react';
import type { AtlasTrip } from '../atlas';
import { shortDate, type Photo } from '../data';
import { scrollToContent } from '../hooks';
import type { TripEditorial } from '../trip-editorial';
import JournalImage from './JournalImage';

type Props = {
  trip: AtlasTrip;
  editorial: TripEditorial;
  onPhotos: (photos: Photo[], index?: number) => void;
  onPlace: (id: string) => void;
  onDay: (date: string) => void;
};

export default function TripStory({ trip, editorial, onPhotos, onPlace, onDay }: Props) {
  const byId = new Map(trip.photos.map((photo) => [photo.id, photo]));
  return (
    <section className="trip-story" aria-labelledby="trip-story-title">
      <div className="trip-story-heading">
        <div><p className="atlas-kicker">PAGES FROM THE JOURNEY</p><h2 id="trip-story-title">{editorial.chapterHeading}</h2></div>
        <p className="trip-story-lead">{editorial.lead}</p>
      </div>
      <nav className="trip-chapter-index" aria-label="旅行章节目录">
        {editorial.chapters.map((chapter, index) => <button key={chapter.id} onClick={() => scrollToContent(`#chapter-${chapter.id}`)}><span>{String(index + 1).padStart(2, '0')}</span>{chapter.title}<ArrowDown size={13} /></button>)}
      </nav>
      <div className="trip-chapters">
        {editorial.chapters.map((chapter, index) => {
          const photos = chapter.photoIds.map((id) => byId.get(id)!).filter(Boolean);
          return (
            <article key={chapter.id} id={`chapter-${chapter.id}`} className={`trip-chapter ${index % 2 ? 'chapter-reverse' : ''}`} aria-labelledby={`chapter-title-${chapter.id}`}>
              <div className="trip-chapter-copy">
                <p className="atlas-kicker">CHAPTER {String(index + 1).padStart(2, '0')} <small className="chapter-date">{photos.length} 张配图</small></p>
                <h3 id={`chapter-title-${chapter.id}`}>{chapter.title}</h3>
                {chapter.paragraphs.map((paragraph, i) => <p className="chapter-paragraph" key={i}>{paragraph}</p>)}
                <div className="chapter-place-links">{chapter.placeIds.map((id) => {
                  const place = trip.places.find((place) => place.id === id)!;
                  return <button key={id} onClick={() => onPlace(id)}><MapPin size={12} />{place.name}<ArrowUpRight size={12} /></button>;
                })}</div>
              </div>
              <div className="trip-chapter-photos">
                {photos.map((photo, photoIndex) => <figure key={photo.id} className={photoIndex === 0 ? 'chapter-photo-main' : ''}>
                  <button aria-label={`放大章节照片：${photo.caption}`} onClick={() => onPhotos(photos, photoIndex)}><JournalImage photo={photo} framed sizes={photoIndex === 0 ? '(max-width: 760px) calc(100vw - 40px), 650px' : '(max-width: 760px) 44vw, 310px'} /><span className="chapter-photo-zoom"><Camera size={15} /></span></button>
                  <figcaption>{photo.caption}<span>{shortDate(photo.date)} · {photo.place}</span></figcaption>
                </figure>)}
              </div>
            </article>
          );
        })}
      </div>
      <section className="trip-day-collection" aria-labelledby="trip-day-collection-title">
        <div className="atlas-section-heading"><div><p className="atlas-kicker">DAY BY DAY</p><h2 id="trip-day-collection-title">每个有照片的日子，都留下一页。</h2></div><p><BookOpen size={13} /> {editorial.days.length} 篇照片短记</p></div>
        <div className="trip-day-cards">{editorial.days.map((day, index) => {
          const photo = byId.get(day.coverId)!;
          const count = trip.photos.filter((photo) => photo.date === day.date).length;
          return <button key={day.date} className="trip-day-card" aria-label={`读第 ${index + 1} 天：${day.title}`} onClick={() => onDay(day.date)}>
            <JournalImage photo={photo} framed sizes="(max-width: 760px) 40vw, 300px" />
            <span className="day-card-copy"><span className="day-card-date">DAY {String(index + 1).padStart(2, '0')} <i />{shortDate(day.date)}</span><strong>{day.title}</strong><span className="day-card-count">{count} 张照片<ArrowUpRight size={14} /></span></span>
          </button>;
        })}</div>
      </section>
    </section>
  );
}
