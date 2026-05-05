const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

let channel;

async function connectQueue() {
    const connection = await amqp.connect("amqp://rabbitmq");
    channel = await connection.createChannel();
    await channel.assertQueue("build_queue");
}
connectQueue();


// 🟢 UI PAGE
app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>CI/CD Pipeline Manager</title>
            <style>
                body { font-family: Arial; text-align: center; margin-top: 50px; }
                button { padding: 15px 30px; font-size: 18px; cursor: pointer; }
            </style>
        </head>
        <body>
            <h1>🚀 DevOps Pipeline Dashboard</h1>
            <p>Trigger your CI/CD pipeline</p>
            <button onclick="trigger()">Start Pipeline</button>

            <script>
                function trigger() {
                    fetch('/trigger', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({repo: 'demo', branch: 'main'})
                    })
                    .then(res => res.text())
                    .then(data => alert(data));
                }
            </script>
        </body>
        </html>
    `);
});


// 🟢 API
app.post("/trigger", async (req, res) => {
    const payload = {
        repo: req.body.repo,
        branch: req.body.branch
    };

    console.log("Pipeline triggered:", payload);

    channel.sendToQueue("build_queue", Buffer.from(JSON.stringify(payload)));

    res.send("Pipeline triggered 🚀");
});

app.listen(3000, () => console.log("Orchestrator running on 3000"));