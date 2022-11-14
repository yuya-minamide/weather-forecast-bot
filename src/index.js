const https = require("https")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const TOKEN = process.env.LINE_ACCESS_TOKEN

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
});

app.post("/webhook", function(req, res) {
    const event = req.body.events[0];
    const replyToken = event.replyToken;
    const eventType = event.type;

    if (eventType !== "message") {
        return;
    }

    const messageType = event.message.type;
    const messageText = event.message.text;

    if (messageType !== "text") {
        return;
    }

    const body = JSON.stringify({
        replyToken,
        messages: [
            {
                "type": "text",
                "text": `You just said: ${messageText}`,
            }
        ]
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
            process.stdout.write(d)
        });
    });

    // Handle error
    request.on("error", (err) => {
        console.error(err)
    });

    // Send data
    request.write(body);
    request.end();
});