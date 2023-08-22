const main = document.querySelector(".main");
const locationInfo = document.querySelector("#location");
const temperatureInfo = document.querySelector("#temperature");
const windSpeedInfo = document.querySelector("#wind_speed");
const timeIcon = document.querySelector("#time_icon");

const dayTimeIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1zdW4iPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiLz48cGF0aCBkPSJNMTIgMnYyIi8+PHBhdGggZD0iTTEyIDIwdjIiLz48cGF0aCBkPSJtNC45MyA0LjkzIDEuNDEgMS40MSIvPjxwYXRoIGQ9Im0xNy42NiAxNy42NiAxLjQxIDEuNDEiLz48cGF0aCBkPSJNMiAxMmgyIi8+PHBhdGggZD0iTTIwIDEyaDIiLz48cGF0aCBkPSJtNi4zNCAxNy42Ni0xLjQxIDEuNDEiLz48cGF0aCBkPSJtMTkuMDcgNC45My0xLjQxIDEuNDEiLz48L3N2Zz4=";
const nightTimeIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1tb29uIj48cGF0aCBkPSJNMTIgM2E2IDYgMCAwIDAgOSA5IDkgOSAwIDEgMS05LTlaIi8+PC9zdmc+";

onLocation();

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(onLocation, onLocation);
} else {
  main.innerHTML = "Geolocation is not supported by this browser.";
}

function onLocation(position) {
  let url = `https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en`;

  if (position && position.coords) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    url += `&latitude=${lat}&longitude=${lon}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        updateLocation(
          data.localityInfo.administrative[
            data.localityInfo.administrative.length - 1
					].name,
					lat,
					lon
        );
      });
  } else {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        updateLocation(
          data.localityInfo.administrative[
            data.localityInfo.administrative.length - 1
					].name,
					data.latitude,
					data.longitude
        );
      });
  }
}

function getWeather(lat, lon) {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto&forecast_days=1&windspeed_unit=kn`
  )
    .then((response) => response.json())
    .then((data) => {
      updateWeather(data.current_weather);
    });
}

function updateWeather(weather) {
	const temp = makeItClearer(weather.temperature, true);
	const windSpeed = makeItClearer(weather.windspeed, false);
	const day = weather.is_day;

	temperatureInfo.innerHTML = temp;
	windSpeedInfo.innerHTML = windSpeed;

	if (day) {
		timeIcon.src = dayTimeIcon;
	} else {
		timeIcon.src = nightTimeIcon;
	}
}

function updateLocation(userLocation, lat, lon) {
	locationInfo.innerHTML = userLocation;
	getWeather(lat, lon);
}

function makeItClearer(value, higherIsBetter) {
	return (value + (value * 0.3 * (higherIsBetter ? 1 : -1))).toFixed(1);
}

let timer = null;

function startTimer() {
  clearTimer();
  timer = setTimeout(() => {
    html2canvas(document.querySelector(".screenshot")).then((canvas) => {
      canvas.toBlob((blob) => navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]));
      alert("Copied image to clipboard");
    });
  }, 1000);
}

function clearTimer() {
  clearTimeout(timer);
}

document.addEventListener("mousedown", startTimer);
document.addEventListener("touchstart", startTimer);
document.addEventListener("mouseup", clearTimer);
document.addEventListener("touchend", clearTimer);