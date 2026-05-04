const amqp = require("amqplib");

async function start() {
    const connection = await amqp.connect("amqp://rabbitmq");
    const channel = await connection.createChannel();

    await channel.assertQueue("monitor_queue");

    channel.consume("monitor_queue", (msg) => {
        const data = JSON.parse(msg.content.toString());
        console.log("Monitoring pipeline for:", data.repo);

        channel.ack(msg);
    });
}

start();