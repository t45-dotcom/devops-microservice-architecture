const amqp = require("amqplib");

async function start() {
    const connection = await amqp.connect("amqp://rabbitmq");
    const channel = await connection.createChannel();

    await channel.assertQueue("deploy_queue");
    await channel.assertQueue("monitor_queue");

    channel.consume("deploy_queue", (msg) => {
        const data = JSON.parse(msg.content.toString());
        console.log("Deploying application...");

        setTimeout(() => {
            console.log("Deployment successful 🚀");

            channel.sendToQueue("monitor_queue", Buffer.from(JSON.stringify(data)));
            channel.ack(msg);
        }, 2000);
    });
}

start();