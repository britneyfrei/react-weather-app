import axios from "axios";
import { useState, useEffect } from "react";
import DateTime from "./components/DateTime";

const API_KEY = "6b161bbc76ed86633aabd4e467ed334e";

function App() {
	const [data, setData] = useState({});
	const [locationData, setLocationData] = useState({});
	const [location, setLocation] = useState("");
	const [lat, setLat] = useState("");
	const [lon, setLon] = useState("");
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const getDay = (i) => days[(new Date().getDay() + i) % 7];

	const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`;
	const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`;
	const geoReverseUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;

	const fetchWeatherData = () => {
		axios
			.get(weatherUrl)
			.then((response) => {
				setData(response.data);
				console.log("data", response.data);
			})
			.catch((error) => {
				console.log("Error fetching weather data:", error);
			});
	};

	const fetchGeoData = () => {
		axios
			.get(geoReverseUrl)
			.then((response) => {
				setLocationData(response.data[0]);
				console.log("forecast", response.data);
			})
			.catch((error) => {
				console.log("Error fetching forecast data:", error);
			});
	};

	const searchLocation = (event) => {
		if (event.key === "Enter") {
			axios
				.get(geoURL)
				.then((response) => {
					setLat(response.data[0].lat);
					setLon(response.data[0].lon);
				})
				.then(() => {
					fetchWeatherData();
				})
				.then(() => {
					fetchGeoData();
					setLocation("");
				})
				.catch((error) => {
					console.log("Error fetching location data:", error);
				});
		}
	};

	useEffect(() => {
		const fetchCurrentLocation = () => {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLat(position.coords.latitude);
					setLon(position.coords.longitude);
				},
				(error) => {
					console.log("Error getting current location:", error);
				}
			);
		};

		fetchCurrentLocation();
	}, []);

	useEffect(() => {
		if (lat !== "" && lon !== "") {
			fetchWeatherData();
			fetchGeoData();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lat, lon]);

	return (
		<div className="app">
			<div className="container">
				<div className="current-info">
					<div className="date-container">
						{data.current && (
							<div className="temp" id="time">
								{data.current.temp.toFixed()}°F
								<img
									src={
										"http://openweathermap.org/img/wn/" +
										data.current.weather[0].icon +
										"@2x.png"
									}
									alt="weather icon"
									className="w-icon"
								/>
							</div>
						)}
						{data.current && <DateTime timezone={data.current.timezone} />}

						<div className="others" id="current-weather-items">
							<div className="weather-item">
								<div>Feels Like</div>
								{data.current && (
									<div>{data.current.feels_like.toFixed()}°F</div>
								)}
							</div>
							<div className="weather-item">
								<div>Humidity</div>
								{data.current && <div>{data.current.humidity}%</div>}
							</div>
							<div className="weather-item">
								<div>Wind Speed</div>
								{data.current && <div>{data.current.wind_speed} MPH</div>}
							</div>
							<div className="weather-item">
								<div>Sunrise</div>
								{data.current && (
									<div>
										{new Date(data.current.sunrise * 1000).toLocaleTimeString(
											[],
											{
												hour: "numeric",
												minute: "2-digit",
											}
										)}
									</div>
								)}
							</div>
							<div className="weather-item">
								<div>Sunset</div>
								{data.current && (
									<div>
										{new Date(data.current.sunset * 1000).toLocaleTimeString(
											[],
											{
												hour: "numeric",
												minute: "2-digit",
											}
										)}
									</div>
								)}
							</div>
						</div>
					</div>
					<div className="search-container">
						<input
							type="text"
							value={location}
							onChange={(event) => setLocation(event.target.value)}
							onKeyDown={searchLocation}
							placeholder="Enter City"
						/>
					</div>
					<div className="location-container">
						<div className="location">{locationData.name}</div>
						<div className="country">
							{locationData.state}, {locationData.country}
						</div>
					</div>
				</div>
			</div>
			{data.daily && data.daily[0].weather && data.daily[0].temp && (
				<div className="future-forecast">
					<div className="today" id="current-temp">
						<img
							src={
								"http://openweathermap.org/img/wn/" +
								data.daily[0].weather[0].icon +
								"@2x.png"
							}
							alt="weather icon"
							className="w-icon"
						/>

						<div className="other">
							<div className="day">{getDay(0)}</div>
							<div className="temp">
								Low - {data.daily[0].temp.min.toFixed()}°F
							</div>

							<div className="temp">
								High - {data.daily[0].temp.max.toFixed()}°F
							</div>
						</div>
					</div>

					<div className="weather-forecast" id="weather-forecast">
						{data.daily &&
							data.daily.slice(1).map((forecast, i) => (
								<div
									key={data.daily[i + 1].dt}
									className="weather-forecast-item"
								>
									<div className="day">{getDay(i + 1).slice(0, 3)}</div>
									{data.daily[i + 1].weather[0] && (
										<img
											src={
												"http://openweathermap.org/img/wn/" +
												data.daily[i + 1].weather[0].icon +
												"@2x.png"
											}
											alt="weather icon"
											className="w-icon"
										/>
									)}

									<div className="temp">
										Low - {forecast.temp.min.toFixed()}°F
									</div>
									<div className="temp">
										High - {forecast.temp.max.toFixed()}°F
									</div>
								</div>
							))}
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
