const get = id => document.getElementById(id);
const setText = (id, value) => { get(id).textContent = value; };

const conditions = {
  0: ['Clear sky', '☀️', 'sun'], 1: ['Mainly clear', '🌤️', 'sun'],
  2: ['Partly cloudy', '⛅', 'cloud'], 3: ['Overcast', '☁️', 'cloud'],
  45: ['Fog', '🌫️', 'fog'], 48: ['Rime fog', '🌫️', 'fog'],
  51: ['Light drizzle', '🌦️', 'rain'], 53: ['Drizzle', '🌦️', 'rain'],
  55: ['Heavy drizzle', '🌧️', 'rain'], 61: ['Light rain', '🌦️', 'rain'],
  63: ['Rain', '🌧️', 'rain'], 65: ['Heavy rain', '🌧️', 'rain'],
  71: ['Light snow', '🌨️', 'snow'], 73: ['Snow', '❄️', 'snow'],
  75: ['Heavy snow', '❄️', 'snow'], 80: ['Light showers', '🌦️', 'rain'],
  81: ['Showers', '🌧️', 'rain'], 82: ['Heavy showers', '⛈️', 'storm'],
  85: ['Light snow showers', '🌨️', 'snow'], 86: ['Heavy snow showers', '🌨️', 'snow'],
  95: ['Thunderstorm', '⛈️', 'storm'], 96: ['Thunderstorm + hail', '⛈️', 'storm'],
  99: ['Thunderstorm + hail', '⛈️', 'storm']
};

function background(kind, night) {
  const top = night ? '#081226' : '#3e86c5';
  const bottom = night ? '#17284b' : '#94d4f3';
  let shapes = '';
  if (kind === 'sun') shapes = '<circle cx="610" cy="130" r="72" fill="#ffd76a"/>';
  if (kind === 'cloud') shapes = '<g fill="#ecf7ff99"><ellipse cx="560" cy="170" rx="120" ry="62"/><ellipse cx="660" cy="150" rx="95" ry="75"/><ellipse cx="735" cy="178" rx="125" ry="58"/></g>';
  if (kind === 'fog') shapes = '<g stroke="#fff8" stroke-width="30" stroke-linecap="round"><line x1="100" y1="145" x2="1050" y2="145"/><line x1="40" y1="230" x2="980" y2="230"/><line x1="130" y1="315" x2="1030" y2="315"/></g>';
  if (kind === 'rain' || kind === 'storm') shapes = '<g fill="#edf8ffb5"><ellipse cx="520" cy="150" rx="130" ry="66"/><ellipse cx="655" cy="130" rx="110" ry="85"/><ellipse cx="780" cy="160" rx="140" ry="62"/></g>';
  if (kind === 'snow') shapes = '<g fill="#fff">' + Array.from({ length: 24 }, (_, index) => `<circle cx="${60 + (index * 83) % 1000}" cy="${120 + (index * 97) % 500}" r="${4 + (index % 4) * 2}"/>`).join('') + '</g>';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 700"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="1100" height="700" fill="url(#g)"/>${shapes}<path d="M0 560 Q250 470 500 560 T1100 540 V700 H0Z" fill="#13202b99"/></svg>`;
  return `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}")`;
}

function compass(degrees) {
  return ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'][Math.round(degrees / 22.5) % 16];
}
function minutes(value) { return value == null ? '-' : `${Math.round(value / 60)} min`; }
function distance(value) { return value == null ? '-' : value >= 1000 ? `${(value / 1000).toFixed(1)} km` : `${Math.round(value)} m`; }
function celsius(value) { return value == null ? '-' : `${Number(value).toFixed(1)}°C`; }
function millimeters(value) { return value == null ? '-' : `${Number(value).toFixed(1)} mm`; }

let place;
function applyPrivacy() {
  const hidden = localStorage.getItem('weather-hide-location') === '1';
  get('hideLocation').checked = hidden;
  if (!place) return;
  setText('loc', hidden ? 'Local Weather' : `${place.city || 'Unknown city'}, ${place.country_code || ''}`);
  setText('coords', hidden ? 'Hidden' : `${Number(place.latitude).toFixed(2)}, ${Number(place.longitude).toFixed(2)}`);
  setText('tz', hidden ? 'Hidden' : place.timezone || '-');
  // Update city label in weather.html iframe when privacy toggled
  updateWeatherHtmlCity();
}

// Synchronize the city label in the separate weather.html page based on the hideLocation setting.
function updateWeatherHtmlCity() {
  try {
    const iframe = parent.document.querySelector('iframe[src="weather.html"]');
    if (!iframe) return;
    const cityEl = iframe.contentDocument?.getElementById('city');
    if (!cityEl) return;
    const hidden = localStorage.getItem('weather-hide-location') === '1';
    cityEl.textContent = hidden ? 'Weather Today' : 'Loading...';
  } catch (e) {
    // Silently ignore cross-origin or access errors; the iframe may not be present.
  }
}

async function getLocation() {
  try {
    const response = await fetch('https://ipinfo.io/json');
    if (!response.ok) throw new Error('IP geolocation failed');
    const info = await response.json();
    const [latitude, longitude] = (info.loc || '').split(',').map(Number);
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) return { ...info, latitude, longitude };
  } catch (error) {
    console.warn(error);
  }
  return { city: 'New York', country_code: 'US', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' };
}

async function loadWeather() {
  try {
    place = await getLocation();
    applyPrivacy();
    setText('status', 'Loading weather...');
    const current = 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,dew_point_2m,vapour_pressure_deficit';
    const daily = 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_probability_max';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(place.latitude)}&longitude=${encodeURIComponent(place.longitude)}&current=${current}&daily=${daily}&timezone=auto&forecast_days=3&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather request failed');
    const data = await response.json();
    const currentWeather = data.current;
    const dailyWeather = data.daily;
    const condition = conditions[currentWeather.weather_code] || ['Unknown', '🌡️', 'cloud'];

    setText('icon', condition[1]);
    setText('temp', `${Math.round(currentWeather.temperature_2m)}°`);
    setText('cond', condition[0]);
    setText('feels', `Feels like ${Math.round(currentWeather.apparent_temperature)}°`);
    get('bg').style.backgroundImage = background(condition[2], !currentWeather.is_day);
    setText('time', new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: place.timezone }).format(new Date()));
    setText('humidity', `${currentWeather.relative_humidity_2m}%`);
    setText('dew', celsius(currentWeather.dew_point_2m));
    setText('pressure', `${Math.round(currentWeather.pressure_msl)} hPa`);
    setText('visibility', distance(currentWeather.visibility));
    setText('clouds', `${currentWeather.cloud_cover}%`);
    setText('precip', millimeters(currentWeather.precipitation));
    setText('rain', millimeters(currentWeather.rain));
    setText('showers', millimeters(currentWeather.showers));
    setText('snow', millimeters(currentWeather.snowfall));
    setText('wind', `${Math.round(currentWeather.wind_speed_10m)} km/h`);
    setText('gusts', `${Math.round(currentWeather.wind_gusts_10m)} km/h`);
    setText('direction', `${compass(currentWeather.wind_direction_10m)} ${Math.round(currentWeather.wind_direction_10m)}°`);
    setText('uv', dailyWeather.uv_index_max?.[0] ?? '-');
    setText('vpd', currentWeather.vapour_pressure_deficit == null ? '-' : `${Number(currentWeather.vapour_pressure_deficit).toFixed(2)} kPa`);
    setText('sunrise', new Date(dailyWeather.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setText('sunset', new Date(dailyWeather.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setText('daylight', minutes(dailyWeather.daylight_duration[0]));
    setText('sunshine', minutes(dailyWeather.sunshine_duration[0]));
    setText('elev', data.elevation == null ? '-' : `${Math.round(data.elevation)} m`);
    get('days').innerHTML = dailyWeather.time.map((date, index) => {
      const dayCondition = conditions[dailyWeather.weather_code[index]] || ['Unknown', '🌡️', 'cloud'];
      const day = new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' });
      return `<div class="day"><b>${day}</b><span>${dayCondition[1]}</span><small>${Math.round(dailyWeather.temperature_2m_max[index])}° / ${Math.round(dailyWeather.temperature_2m_min[index])}°</small><small>${dailyWeather.precipitation_probability_max?.[index] ?? 0}% rain</small></div>`;
    }).join('');
    get('status').remove();
    get('main').classList.remove('hidden');
  } catch (error) {
    get('status').innerHTML = `<span class="err">Unable to load weather.<br>${error.message}</span>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  get('openSettings').onclick = () => get('settings').classList.remove('hidden');
  get('closeSettings').onclick = () => get('settings').classList.add('hidden');
  get('hideLocation').onchange = event => {
    localStorage.setItem('weather-hide-location', event.target.checked ? '1' : '0');
    applyPrivacy();
  };
  loadWeather();
});
