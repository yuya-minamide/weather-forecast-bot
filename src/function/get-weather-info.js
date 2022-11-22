import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const getWeatherForecastInfo = async function (messageText) {
	// URL is sent to Open weather API
	const API_KEY = process.env.OPEN_WEATHER_API_KEY;
	const unit = "metric";
	const url =
		"https://api.openweathermap.org/data/2.5/forecast?q=" + messageText + "&appid=" + API_KEY + "&units=" + unit;

	//Get weather forecast data from Open weather API
	const weatherForecastData = await fetch(url);

	const data = await weatherForecastData.json();

	return await data;
};

export default getWeatherForecastInfo;
