import * as dotenv from "dotenv";
import express from "express";
import getWeatherForecastInformation from "./function/getWeatherForecastInformation.js";
import chatPostMessage from "./function/chatPostMessage.js";

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

	// Text and type come from here
	const event = req.body.events[0];

	// The message property contains a message object which corresponds with the message type
	if (event.type !== "message") {
		return;
	}

	// Reply token, text and type information
	const replyToken = event.replyToken;
	const messageType = event.message.type;
	const messageText = event.message.text;

	// This bot uses only text (Message objects can also have types such as image, stamp, etc.)
	if (messageType !== "text") {
		return;
	}

	// Get the weather forecast for the city name sent from the device
	const weatherForecastData = getWeatherForecastInformation(messageText);

	weatherForecastData.then((data) => {
		// Send weather forecast to chat
		chatPostMessage(replyToken, data, messageText);
	});
});
