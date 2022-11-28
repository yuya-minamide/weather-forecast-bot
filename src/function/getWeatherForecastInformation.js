import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const API_KEY = process.env.OPEN_WEATHER_API_KEY;
const OPEN_WEATHER_FORECAST_ROOT_URL = "https://api.openweathermap.org/data/2.5/forecast";

export async function getWeatherForecastInformation(CityName) {
	// URL is sent to Open weather API
	const Url = `${OPEN_WEATHER_FORECAST_ROOT_URL}?q=${CityName}&appid=${API_KEY}&units=metric`;

	//Get weather forecast data from Open weather API
	const WeatherForecastData = await fetch(Url);

	const Data = await WeatherForecastData.json();

	return await Data;
}
