import https from "https";
import * as dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.LINE_ACCESS_TOKEN;

const HEADERS = {
	"Content-Type": "application/json",
	Authorization: `Bearer ${TOKEN}`,
};

// Send four-day weather forecast information to user
export function chatPostMessage(WeatherForecastForFourDays, ReplyToken) {
	const body = JSON.stringify({
		replyToken: ReplyToken,
		messages: WeatherForecastForFourDays,
	});

	const WebhookOptions = {
		hostname: "api.line.me",
		path: "/v2/bot/message/reply",
		method: "POST",
		headers: HEADERS,
		body,
	};

	const Request = https.request(WebhookOptions, (res) => {
		res.on("data", (d) => {
			process.stdout.write(d);
		});
	});

	Request.on("error", (err) => {
		console.error(err);
	});

	Request.write(Body);
	Request.end();
}
