import * as dotenv from "dotenv";
import express from "express";
import { getWeatherForecastInformation } from "./function/getWeatherForecastInformation.js";
import { createMessage } from "./function/createMessage.js";
import { chatPostMessage } from "./function/chatPostMessage.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.sendStatus(200);
});

app.listen(PORT, () => {
	console.log(`This app listening at http://localhost:${PORT}`);
});

app.post("/webhook", function (req, res) {
	res.sendStatus(200);

	// Text and type come from here.
	const Event = req.body.events[0];

	// The message property contains a message object which corresponds with the message type.
	if (Event.type !== "message") {
		return;
	}

	const ReplyToken = Event.replyToken;
	const MessageType = Event.message.type;
	const CityName = Event.message.text;

	// This bot uses only text (Message objects can also have types such as image, stamp, etc.)
	if (MessageType !== "text") {
		return;
	}

	// Get the weather forecast for the city name sent from the device.
	getWeatherForecastInformation(CityName).then((WeatherForecastData) => {
		// Create a four-day weather forecast message.
		const WeatherForecastForFourDays = createMessage(WeatherForecastData, CityName);
		// Send a four-day weather forecast to chat.
		chatPostMessage(WeatherForecastForFourDays, ReplyToken);
	});
});
