import express from "express";
import bodyParser from 'body-parser'
import { Send } from "./send_queue.js";
import amqp from 'amqplib/callback_api.js'
const app = express();

app.use(bodyParser.json({ limit: '50mb' }))

amqp.connect(`amqp://${process.env.RABBIT_USERNAME}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}/`, function (error, connection) {
    if (error) {
        throw error;
    }

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue('mediumQueue', {
            durable: false
        });

        channel.consume('mediumQueue', function (payload) {
            if (payload != null) {
                let contents = JSON.parse(payload.content.toString())
                console.log('===== Receive =====');
                console.log(contents);
            }
        }, {
            noAck: true
        })
    });
});

app.post('/send', function (req, res) {
    const rabbit = new Send().execute(req.body);

    res.json({
        status: 'OKE',
        statusCode: 201,
        message: 'Message success send to rabbitmq server.'
    })
});

app.listen(3000, () => {
    console.log(`ExpressJS started on port`, 3000);
})