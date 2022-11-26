import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const API_KEY = process.env.OPEN_WEATHER_API_KEY;

const getWeatherForecastInformation = async function (messageText) {
	// URL is sent to Open weather API
	const OPENWEATHER_FORECAST_ROOT_URL = "https://api.openweathermap.org/data/2.5/forecast";
	const url = `${OPENWEATHER_FORECAST_ROOT_URL}?q=${messageText}&appid=${API_KEY}&units=metric`;

	//Get weather forecast data from Open weather API
	const weatherForecastData = await fetch(url);

	const data = await weatherForecastData.json();

	return await data;
};

export default getWeatherForecastInformation;
