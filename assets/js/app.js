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

function renderActivity(stop){
  const time = stop[0] || '';
  const title = stop[1] || '';
  const desc = stop[2] || '';
  const place = stop[3] || '';
  const external = stop[4] || '';
  const placeLink = place ? `<a class="maplink" href="${mapSearch(place)}" target="_blank" rel="noopener noreferrer">🗺️ Google Maps 🧭</a>` : '';
  // Add Naver link only for the hotel
  const naverLink = (place && place === 'SimpleStay Hotel Jongno') ? ` <a class="naverlink" href="https://naver.me/5FD16ory" target="_blank" rel="noopener noreferrer">🧭 Naver</a>` : '';
  const externalLink = external ? ` <a class="tourlink" href="${external}" target="_blank" rel="noopener noreferrer">🔗 Tour details</a>` : '';
  return `<article class="activity" data-activity="${(stop.join(' ')).toLowerCase()}"><div class="time">${time}</div><div><h3>${title}</h3><p>${desc}</p><div class="meta">${placeLink}${naverLink}${externalLink}</div></div></article>`;
}

const daysEl=$('#days');
if(daysEl){
  days.forEach((d,i)=>{
    const det=document.createElement('details');
    det.className='day';
    det.dataset.search=(d.date+' '+d.title+' '+d.city+' '+d.stops.flat().join(' ')).toLowerCase();

    const timelineHtml = d.stops.map(renderActivity).join('');

    // parse month/day from d.date (e.g. "Tue · 27 Oct")
    const parseDate = ds => {
      if(!ds) return {month:'',day:''};
      // try to find day and month
      const m = ds.match(/(\d{1,2})\s*([A-Za-z]+)/);
      if(m) return {day:m[1],month:m[2]};
      const m2 = ds.match(/([A-Za-z]+)\s*(\d{1,2})/);
      if(m2) return {month:m2[1],day:m2[2]};
      return {month:'',day:ds};
    };
    const pd = parseDate(d.date);
    const month = pd.month || '';
    const dayNum = pd.day || '';

    det.innerHTML = `
      <summary>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="background:#719CAA;color:#245b48;border-radius:10px;padding:8px 10px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:56px;box-shadow:0 1px 0 rgba(0,0,0,0.04);">
            <div style="font-size:12px;line-height:1;margin:0;">${month}</div>
            <div style="font-size:18px;font-weight:800;line-height:1;margin-top:2px;">${dayNum}</div>
          </div>
          <div class="dayhead">
            <h2 style="margin:0;font-size:1.05rem;color:#0b2f24;">${d.title}</h2>
            <p style="margin:2px 0 0;color:#666;font-size:0. ninerem;">${d.city} · ${d.stops.length} planned stops</p>
          </div>
        </div>
      </summary>
      <div class="daybody">
        <div class="totals"><span>Activity cost total (fixed)</span><span class="totalval">€ <span class="sum-eur">0.00</span> / ₩ <span class="sum-krw">0</span></span></div>
        <div class="timeline">${timelineHtml}</div>
      </div>
    `;

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
