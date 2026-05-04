const amqp = require("amqplib");

async function start() {
    const connection = await amqp.connect("amqp://rabbitmq");
    const channel = await connection.createChannel();

    await channel.assertQueue("build_queue");
    await channel.assertQueue("test_queue");

    channel.consume("build_queue", (msg) => {
        const data = JSON.parse(msg.content.toString());
        console.log("Building project:", data.repo);

        setTimeout(() => {
            console.log("Build complete ✅");

            channel.sendToQueue("test_queue", Buffer.from(JSON.stringify(data)));
            channel.ack(msg);
        }, 2000);
    });
}

start();