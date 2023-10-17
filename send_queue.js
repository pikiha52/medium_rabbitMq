import amqp from "amqplib/callback_api.js";

export class Send {
    constructor() {
        this.rabbit = amqp;
    }

    execute(payload) {
        this.rabbit.connect(`amqp://${process.env.RABBIT_USERNAME}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}/`, function (error, connection) {
            if (error) {
                throw error;
            }

            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }

                var data = JSON.stringify(payload);
                channel.assertQueue('mediumQueue', {
                    durable: false
                });

                channel.sendToQueue('mediumQueue', Buffer.from(data));
            });
        });
    }
}