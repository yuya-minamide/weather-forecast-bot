import https from "https";
import * as dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.LINE_ACCESS_TOKEN;

// Request header
const headers = {
	"Content-Type": "application/json",
	Authorization: `Bearer ${TOKEN}`,
};

// Send four-day weather forecast information to user
const chatPostWithWeatherInfo = function (replyToken, weatherForecastData, messageText) {
	// Set four-day weather forecast information to message array
	const message = [];

	// Information retrieved from the weather API is every 3 hours for 5 days(40 data in total => 24h/3h*5d=40)
	// Use one piece of information per day for four days
	for (let i = 0; i < 32; i += 8) {
		const forecastTime = weatherForecastData.list[i].dt_txt;
		// Forecast time data contains time information(2022-01-01 00:00:00) but this bot uses only date information.
		const forecastDate = forecastTime.substring(0, forecastTime.length - 9);
		const weatherDescription = weatherForecastData.list[i].weather[0].main;
		const forecastObj = {
			type: "text",
			text: `${forecastDate}: ${weatherDescription}`,
		};
		message.push(forecastObj);
	}

	// Add initial descriptive text to message
	const firstMessage = {
		type: "text",
		text: `This is the four-day weather forecast for ${messageText}.`,
	};
	message.unshift(firstMessage);

	// Set body to send weather forecast information to user
	const body = JSON.stringify({
		replyToken,
		messages: message,
	});

	// Options to pass into the request
	const webhookOptions = {
		hostname: "api.line.me",
		path: "/v2/bot/message/reply",
		method: "POST",
		headers,
		body,
	};

	// Define request
	const request = https.request(webhookOptions, (res) => {
		res.on("data", (d) => {
			process.stdout.write(d);
		});
	});

	// Handle error
	request.on("error", (err) => {
		console.error(err);
	});

	// Send data
	request.write(body);
	request.end();
};

export default chatPostWithWeatherInfo;
