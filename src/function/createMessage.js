// Eight weather data is sent per day from weatherAPI(each data represents data for every three hours)
const WEATHER_DATA_PER_DAY = 8;
// This bot uses 4 days of data
const WEATHER_DATA_PER_FOUR_DAYS = WEATHER_DATA_PER_DAY * 4;

export function createMessage(WeatherForecastData, CityName) {
	const WeatherForecastForFourDays = [
		{
			type: "text",
			text: `This is the four-day weather forecast for ${CityName}.`,
		},
	];

	for (let i = 0; i < WEATHER_DATA_PER_FOUR_DAYS; i += WEATHER_DATA_PER_DAY) {
		// Forecast date data contains time information such as YYYY-MM-DD HH:MM:SS(but this bot uses only YYYY-MM-DD)
		// Extract 10 characters from left which is YYYY-MM-DD
		const ForecastDate = WeatherForecastData.list[i].dt_txt.substring(0, 11);

		const WeatherDescription = WeatherForecastData.list[i].weather[0].main;

		const WeatherForecastForOneDay = {
			type: "text",
			text: `${ForecastDate}: ${WeatherDescription}`,
		};
		WeatherForecastForFourDays.push(WeatherForecastForOneDay);
	}

	return WeatherForecastForFourDays;
}
