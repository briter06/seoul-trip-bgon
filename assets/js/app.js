const $=s=>document.querySelector(s);
const enc=s=>encodeURIComponent(s);
const normalizePlace=place=>{
  if(!place) return '';
  const map={
    'Transport':'Gyeongju Station',
    'Busan hotel':'Busan Station',
    'KTX':'Seoul Station',
    'Current location':'Current location',
    'SimpleStay Hotel Jongno':'SimpleStay Hotel Jongno',
    'Seoul':'Seoul',
    'Busan':'Busan',
    'Gyeongju':'Gyeongju Historic District'
  };
  return map[place] || place;
};
const mapSearch=place=>`https://www.google.com/maps/search/?api=1&query=${enc(normalizePlace(place))}`;
const routeUrl=(origin,destination,waypoints=[],mode='')=>{
  const from=normalizePlace(origin);
  const to=normalizePlace(destination);
  const params=[];
  if(from==='Current location') params.push(`&origin=${enc('Current location')}`);
  else if(from) params.push(`&origin=${enc(from)}`);
  params.push(`&destination=${enc(to)}`);
  if(waypoints.length) params.push(`&waypoints=${enc(waypoints.map(normalizePlace).join('|'))}`);
  if(mode) params.push(`&travelmode=${enc(mode)}`);
  return `https://www.google.com/maps/dir/?api=1${params.join('')}`;
};

function renderActivity(stop){
  const time = stop[0] || '';
  const title = stop[1] || '';
  const desc = stop[2] || '';
  const place = stop[3] || '';
  const external = stop[4] || '';
  const placeLink = place ? `<a class="maplink" href="${mapSearch(place)}" target="_blank" rel="noopener noreferrer">🗺️ Google Maps 🧭</a>` : '';
  const externalLink = external ? ` <a class="tourlink" href="${external}" target="_blank" rel="noopener noreferrer">🔗 Tour details</a>` : '';
  return `<article class="activity" data-activity="${(stop.join(' ')).toLowerCase()}"><div class="time">${time}</div><div><h3>${title}</h3><p>${desc}</p><div class="meta">${placeLink}${externalLink}</div></div></article>`;
}

const daysEl=$('#days');
if(daysEl){
  days.forEach((d,i)=>{
    const det=document.createElement('details');
    det.className='day';
    det.dataset.search=(d.date+' '+d.title+' '+d.city+' '+d.stops.flat().join(' ')).toLowerCase();
    const routeStops=d.stops.map(s=>normalizePlace(s[3])).filter(Boolean);
    const routeOrigin=i===0?'Current location':routeStops[0];
    const routeDestination=i===0?'Brussels Airport':routeStops[routeStops.length-1]||d.city;
    const midStops=i===0?[]:routeStops.slice(1,-1);
    const navUrl = routeUrl(routeOrigin, routeDestination, routeStops.slice(1), 'walking');
    const routeViewUrl = routeUrl(routeOrigin, routeDestination, midStops);
    const timelineHtml = d.stops.map(renderActivity).join('');
    det.innerHTML=`<summary><div class="daynum">${String(i+1).padStart(2,'0')}</div><div class="dayhead"><h2>${d.date} – ${d.title}</h2><p>${d.city} · ${d.stops.length} planned stops</p></div></summary><div class="daybody"><div class="dayactions"><a class="btn primary" target="_blank" rel="noopener noreferrer" href="${routeViewUrl}">🗺️ Open day route in Google Maps 🧭</a> <a class="btn" target="_blank" rel="noopener noreferrer" href="${navUrl}">🧭 Open trip navigation</a></div><div class="totals"><span>Activity cost total (fixed)</span><span class="totalval">€ <span class="sum-eur">0.00</span> / ₩ <span class="sum-krw">0</span></span></div><div class="timeline">${timelineHtml}</div></div>`;
    daysEl.appendChild(det);
  });
}

$('#expand').onclick=()=>document.querySelectorAll('.day').forEach(d=>d.open=true);
$('#collapse').onclick=()=>document.querySelectorAll('.day').forEach(d=>d.open=false);

$('#search').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase().trim();
  let n=0;
  document.querySelectorAll('.day').forEach(d=>{
    const match=d.dataset.search.includes(q);
    d.style.display=match||!q?'':'none';
    if(match)n++;
    if(q&&match)d.open=true;
  });
  $('#empty')&&($('#empty').style.display=n?'none':'block');
});
