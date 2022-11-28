import https from "https";
import * as dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.LINE_ACCESS_TOKEN;

const HEADERS = {
	"Content-Type": "application/json",
	Authorization: `Bearer ${TOKEN}`,
};

// Send four-day weather forecast information to user
export function chatPostMessage(replyToken, weatherForecastData, cityName) {
	const weatherForecastForFourDays = [
		{
			type: "text",
			text: `This is the four-day weather forecast for ${cityName}.`,
		},
	];

	//Eight weather data is sent per day from weatherAPI(each data represents data for every three hours)
	const weatherDataPerDay = 8;
	//Five days of weather data is sent from weatherAPI(but this bot uses data for only four days)
	const weatherDataPerFiveDays = weatherDataPerDay * 5;

	for (let i = 0; i < weatherDataPerFiveDays - weatherDataPerDay; i += weatherDataPerDay) {
		// Forecast date data contains time information such as YYYY-MM-DD HH:MM:SS(but this bot uses only YYYY-MM-DD)
		//Extract 10 characters from left which is YYYY-MM-DD
		const forecastDate = weatherForecastData.list[i].dt_txt.substring(0, 11);

		const weatherDescription = weatherForecastData.list[i].weather[0].main;

		const weatherForecastForOneDay = {
			type: "text",
			text: `${forecastDate}: ${weatherDescription}`,
		};
		weatherForecastForFourDays.push(weatherForecastForOneDay);
	}

	const body = JSON.stringify({
		replyToken,
		messages: weatherForecastForFourDays,
	});

	const webhookOptions = {
		hostname: "api.line.me",
		path: "/v2/bot/message/reply",
		method: "POST",
		headers: HEADERS,
		body,
	};

	const request = https.request(webhookOptions, (res) => {
		res.on("data", (d) => {
			process.stdout.write(d);
		});
	});

	request.on("error", (err) => {
		console.error(err);
	});

	request.write(body);
	request.end();
}
