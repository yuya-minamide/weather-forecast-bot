const https = require("https");
const TOKEN = process.env.LINE_ACCESS_TOKEN;

const chatPostWithWeatherInfo = function(event) {
     // Text and type information
    const replyToken = event.replyToken;
    const messageType = event.message.type;
    const messageText = event.message.text;

    if (messageType !== "text") {
        return;
    }
    
    // URL is sent to Open weather API
    const APIKEY = process.env.OPEN_WEATHER_API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + messageText + "&appid=" + APIKEY + "&units=" + unit;

    // Set information
    https.get(url, function(response) {
        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            console.log(weatherData);

            // Set four-day weather forecast information to message array
            const message = [];
            for (let i = 0; i < 32; i += 8) {
                const forecastDate = weatherData.list[i].dt_txt;
                const dataRemovedTime = forecastDate.substring(0, forecastDate.length - 9);
                const weatherDescription = weatherData.list[i].weather[0].main;
                const forecastObj = {
                                    "type": "text",
                                    "text": `${dataRemovedTime}: ${weatherDescription}`
                                    };
                message.push(forecastObj);
            }
            
            // Add initial descriptive text to message
            const firstMessage = {
                "type": "text",
                "text": `This is the four-day weather forecast for ${messageText}.`
                };
                message.unshift(firstMessage);

            const body = JSON.stringify({
                replyToken,
                messages: message
            });
            
            // Request header
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN}` ,
            };
            
            // Options to pass into the request
            const webhookOptions = {
                hostname: "api.line.me",
                path: "/v2/bot/message/reply",
                method: "POST",
                headers,
                body
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
        });
    });
};

module.exports = { chatPostWithWeatherInfo };