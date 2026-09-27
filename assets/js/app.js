const $=s=>document.querySelector(s);const enc=s=>encodeURIComponent(s);const mapSearch=place=>'https://www.google.com/maps/search/?api=1&query='+enc(place);const routeUrl=(origin,destination,waypoints=[])=>`https://www.google.com/maps/dir/?api=1${origin?`&origin=${enc(origin)}`:''}&destination=${enc(destination)}${waypoints.length?`&waypoints=${enc(waypoints.join('|'))}`:''}`;
const daysEl=$('#days');
if(daysEl){
  days.forEach((d,i)=>{
    const det=document.createElement('details');
    det.className='day';
    det.dataset.search=(d.date+' '+d.title+' '+d.city+' '+d.stops.flat().join(' ')).toLowerCase();
    const routeStops=d.stops.map(s=>s[3]).filter(Boolean);
    const routeOrigin=i===0?'Current location':routeStops[0];
    const routeDestination=routeStops[routeStops.length-1]||d.city;
    const midStops=i===0?[]:routeStops.slice(1,-1);
    det.innerHTML=`<summary><div class="daynum">${String(i+1).padStart(2,'0')}</div><div class="dayhead"><h2>${d.date} – ${d.title}</h2><p>${d.city} · ${d.stops.length} planned stops</p></div></summary><div class="daybody"><div class="dayactions"><a class="btn primary" target="_blank" rel="noopener noreferrer" href="${routeUrl(routeOrigin,routeDestination,midStops)}">🗺️ Open day route in Google Maps 🧭</a></div><div class="route"><strong>Suggested sequence:</strong> ${routeStops.length?routeStops.join(' 🚶 '):d.city}<br><span>Google Maps may adjust the route based on available roads, transit, and stop limits.</span></div><div class="totals"><span>Activity cost total (fixed)</span><span class="totalval">€ <span class="sum-eur">0.00</span> / ₩ <span class="sum-krw">0</span></span></div><div class="timeline">${d.stops.map(s=>`<article class="activity" data-activity="${(s.join(' ')).toLowerCase()}"><div class="time">${s[0]}</div><div><h3>${s[1]}</h3><p>${s[2]}</p><div class="meta"><a class="maplink" href="${mapSearch(s[3])}" target="_blank" rel="noopener noreferrer">🗺️ Google Maps 🧭</a></div></div></article>`).join('')}</div></div>`;
    daysEl.appendChild(det);
  });
}
$('#expand').onclick=()=>document.querySelectorAll('.day').forEach(d=>d.open=true);$('#collapse').onclick=()=>document.querySelectorAll('.day').forEach(d=>d.open=false);
$('#search').addEventListener('input',e=>{const q=e.target.value.toLowerCase().trim();let n=0;document.querySelectorAll('.day').forEach(d=>{const match=d.dataset.search.includes(q);d.style.display=match||!q?'':'none';if(match)n++;if(q&&match)d.open=true;});$('#empty')&&($('#empty').style.display=n?'none':'block');});
