import { ArrowDown, ArrowUpRight, Camera, Compass, MapPin } from 'lucide-react';
import { allPhotos, countries, dateRange, totalCountries, totalDays, totalPhotos, trips, yearRange } from '../atlas';
import { scrollToContent } from '../hooks';
import JournalImage from './JournalImage';
import WorldMap from './WorldMap';

type Props = { country: string; onCountry: (country: string) => void; onTrip: (trip: string) => void };

export default function AtlasOverview({ country, onCountry, onTrip }: Props) {
  const visible = country === 'all' ? trips : trips.filter((trip) => trip.countryCode === country);
  const featured = trips.find((trip) => trip.id === 'new-zealand')!;
  const japan = trips.find((trip) => trip.id === 'japan-spring')!;
  const title = countries.find((item) => item.id === country)?.name ?? '全部旅程';
  return (
    <main className="atlas-page">
      <section className="atlas-hero" aria-labelledby="atlas-title">
        <div className="atlas-hero-copy">
          <p className="atlas-kicker"><span /> A PERSONAL TRAVEL ATLAS</p>
          <h1 id="atlas-title">去过的地方，<br />都有故事。</h1>
          <p className="atlas-lead">从雅加达窗景到云南雪山，从尼罗河到南半球。<br />把照片铺开，再走一遍。</p>
          <div className="atlas-stats">
            <span><strong>{String(totalCountries).padStart(2, '0')}</strong> 个国家</span>
            <span><strong>{String(trips.length).padStart(2, '0')}</strong> 段旅程</span>
            <span><strong>{totalPhotos}</strong> 张照片</span>
          </div>
          <button className="atlas-text-link" onClick={() => scrollToContent('#atlas-journeys')}>
            翻开旅行图册 <ArrowDown size={15} aria-hidden="true" />
          </button>
          <span className="hero-edition">VOL. 01—{String(trips.length).padStart(2, '0')} <i /> {yearRange}</span>
        </div>
        <div className="atlas-hero-images">
          <button className="atlas-featured-photo" onClick={() => onTrip(featured.id)} aria-label="翻开新西兰旅行">
            <JournalImage photo={allPhotos.get(featured.coverId)!} framed loading="eager" fetchPriority="high"
              sizes="(max-width: 760px) calc(100vw - 36px), 740px" />
            <span className="featured-coordinate">44° S · 170° E</span>
            <span className="featured-caption"><small>NEW ZEALAND · 2026</small><span>向南，直到湖水变蓝。<ArrowUpRight size={20} /></span></span>
          </button>
          <button className="atlas-inset-photo" onClick={() => onTrip(japan.id)} aria-label="翻开日本春季旅行">
            <JournalImage photo={allPhotos.get(japan.coverId)!} framed sizes="190px" loading="eager" />
            <span>春天，在日本。<ArrowUpRight size={13} /></span>
          </button>
          <span className="hero-photo-note">风景会远去，照片会留下。</span>
        </div>
      </section>

      <section className="atlas-journeys" id="atlas-journeys" aria-labelledby="journeys-title">
        <div className="atlas-section-heading">
          <div><p className="atlas-kicker">THE COLLECTION</p><h2 id="journeys-title">一段旅程，一本手记。</h2></div>
          <p>{totalDays} 天的照片记录<span> · </span> 按实际拍摄日期整理</p>
        </div>
        <div className="atlas-filter" role="group" aria-label="按国家筛选旅行">
          {countries.map((item) => <button key={item.id} aria-pressed={country === item.id}
            className={country === item.id ? 'active' : ''} onClick={() => onCountry(item.id)}>
            {item.name}<span>{item.id === 'all' ? trips.length : trips.filter((trip) => trip.countryCode === item.id).length}</span>
          </button>)}
        </div>
        <div className="atlas-card-grid" aria-label={title}>
          {visible.map((trip) => (
            <button className={`atlas-trip-card card-${trip.countryCode}`} key={trip.id} onClick={() => onTrip(trip.id)} aria-label={`翻开${trip.country}：${trip.title}`}>
              <div className="trip-card-image">
                <JournalImage photo={allPhotos.get(trip.coverId)!} framed sizes="(max-width: 600px) calc(100vw - 36px), (max-width: 1000px) 45vw, 390px" />
                <span className="trip-card-country">{trip.english}</span>
                <span className="trip-card-arrow"><ArrowUpRight size={20} aria-hidden="true" /></span>
              </div>
              <div className="trip-card-copy">
                <div className="trip-card-date"><span>{dateRange(trip.start, trip.end)}</span><span>{trip.days} 天</span></div>
                <h3>{trip.title}</h3>
                <p>{trip.subtitle}</p>
                <div className="trip-card-bottom"><span>{trip.tags.join(' / ')}</span><span><Camera size={13} /> {trip.photos.length}</span></div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="atlas-footprints" aria-labelledby="footprints-title">
        <div className="footprints-heading">
          <div><p className="atlas-kicker">PLACES I'VE BEEN</p><h2 id="footprints-title">世界很大，慢慢去看。</h2><p>点亮的地方，都有一本手记。<br />选择地图上的国家，回到那段旅程。</p></div>
          <Compass size={47} strokeWidth={.8} aria-hidden="true" />
          <div className="footprints-legend"><i /> 已留下照片的地方</div>
        </div>
        <div className="footprints-map">
          <WorldMap selected={country} onCountry={(next) => { onCountry(next); requestAnimationFrame(() => scrollToContent('#atlas-journeys')); }} />
          <div className="footprints-country-links" aria-label="查看足迹中的旅程">{countries.filter((item) => item.id !== 'all').map((item) => <button key={item.id} aria-pressed={country === item.id} onClick={() => { onCountry(item.id); requestAnimationFrame(() => scrollToContent('#atlas-journeys')); }}><i />{item.name}<ArrowUpRight size={12} /></button>)}</div>
        </div>
      </section>
      <footer className="atlas-footer"><span><MapPin size={14} /> 一路，记下来。</span><p>{yearRange} · 私人的旅行图册</p><span>照片里的旅程，慢慢看。</span></footer>
    </main>
  );
}
