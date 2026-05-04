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

app.post("/trigger", async (req, res) => {
    const payload = {
        repo: req.body.repo,
        branch: req.body.branch
    };

    channel.sendToQueue("build_queue", Buffer.from(JSON.stringify(payload)));

    res.send("Pipeline triggered 🚀");
});

app.listen(3000, () => console.log("Orchestrator running on 3000"));