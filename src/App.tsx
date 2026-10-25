import { Group, Loader } from '@mantine/core';
import { ArrowLeft, ArrowUpRight, Compass } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { atlas, countryValues, trips, tripValues, yearRange } from './atlas';
import { scrollToContent, useQueryState } from './hooks';
import AtlasOverview from './components/AtlasOverview';

const EgyptJournal = lazy(() => import('./EgyptJournal'));
const AtlasTrip = lazy(() => import('./components/AtlasTrip'));
const legacyKeys = ['tab', 'read', 'map', 'place', 'mapPhoto', 'era', 'schedule', 'country'];

export default function App() {
  const [initialTrip] = useState(() => legacyKeys.some((key) => new URLSearchParams(location.search).has(key)) ? 'egypt-dubai' : 'all');
  const [tripId] = useQueryState<string>('trip', initialTrip, tripValues);
  const [country, setCountry] = useQueryState<string>('destination', 'all', countryValues);
  const trip = trips.find((item) => item.id === tripId);
  const newTrip = atlas.trips.find((item) => item.id === tripId);

  useEffect(() => {
    document.title = trip ? `${trip.country} · ${trip.title} | 一路，记下来。` : '一路，记下来。· 私人的旅行图册';
  }, [trip]);

  function navigate(id: string, destination?: string) {
    const url = new URL(location.href);
    url.searchParams.set('trip', id);
    url.hash = '';
    if (destination) url.searchParams.set('destination', destination);
    for (const key of ['tripView', 'stop', 'tripDate', 'tripPlace', 'tripPage', 'tripRead']) url.searchParams.delete(key);
    if (url.href !== location.href) history.pushState(null, '', url);
    window.dispatchEvent(new Event('journal-query-change'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  return (
    <div className="travel-atlas">
      <a className="skip-link" href={tripId === 'all' ? '#atlas-journeys' : tripId === 'egypt-dubai' ? '#explore' : '#trip-explore'}>跳到旅程内容</a>
      <header className="atlas-header">
        <a href={import.meta.env.BASE_URL} onClick={(event) => { event.preventDefault(); navigate('all'); }} className="atlas-brand" aria-label="一路，记下来，返回旅行图册首页">
          <span className="atlas-brand-mark"><Compass size={26} strokeWidth={1.2} /></span><span>一路，记下来。<small>A PERSONAL TRAVEL ATLAS</small></span>
        </a>
        <nav aria-label="主导航"><button className={tripId === 'all' ? 'active' : ''} onClick={() => navigate('all')}>旅行图册</button><button onClick={() => { navigate('all'); requestAnimationFrame(() => scrollToContent('#footprints-title')); }}>我的足迹 <ArrowUpRight size={13} /></button></nav>
        <span className="atlas-header-edition">{yearRange}</span>
      </header>
      {trip && <div className="atlas-breadcrumb"><button onClick={() => navigate('all')}><ArrowLeft size={14} /> 返回图册</button><span>{trip.country} <i>/</i> {trip.start.slice(0, 4)}</span><select aria-label="切换旅行" value={tripId} onChange={(event) => navigate(event.currentTarget.value)}>{trips.map((item) => <option key={item.id} value={item.id}>{item.country} · {item.start.slice(0, 7).replace('-', '.')}</option>)}</select></div>}
      <Suspense fallback={<Group justify="center" py={100}><Loader size="sm" aria-label="正在翻开旅行手记" /></Group>}>
        {tripId === 'egypt-dubai' ? <EgyptJournal /> : newTrip ? <AtlasTrip key={newTrip.id} trip={newTrip} /> : <AtlasOverview country={country} onCountry={setCountry} onTrip={navigate} />}
      </Suspense>
    </div>
  );
}
