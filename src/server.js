const express = require("express");
const app = express();
const weatherInformation = require('./api/chat-post-with-weather-info')
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`This app listening at http://localhost:${PORT}`)
});

app.post("/webhook", function(req, res) {

    res.sendStatus(200);
    
    if (req.body.events[0].type !== "message") {
        return;
    }
    
    // Text and type come from here
    const event = req.body.events[0];
    weatherInformation.chatPostWithWeatherInfo(event);   
});