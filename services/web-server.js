
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./router.js');

let app;
let httpServer;

function start(){
    return new Promise((resolve,reject)=>{
        let port = process.env.HTTP_PORT|| 3000;

        app = express();
        httpServer = http.Server(app);

        // Combineds ghi lại thông tin yêu cầu và phản hồi
        app.use(morgan('combined'));

        //Sẽ phân tích yêu cầu gửi đến JSON và khôi phục chuỗi ngày tháng của ISO 8601 
        //đến các trường hợp của Date
        app.use(bodyParser.json({
            reviver: reviverDates
        }));

        // Cho phép API chạy đc khi deploy lên host
        app.use(enableCORS);

        //đường dẫn tiền tố /api
        app.use('/api', router);

        // Lỗi ngoại lệ
        app.use(handleUnexpectedError);

        // Thêm sự kiện xử lý các kết nối của server để theo dõi các kết nối HTTP
     //   httpServer.on('connection', trackConnection);

        httpServer.listen(port, (err)=>{
            if(err){
                reject(err);
                return;
            }

            console.log('Web server listening on localhost:' + port);

            resolve();
        })
    })
}

module.exports.start = start;

const dateTimeRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

function reviverDates(key, value){
    if(typeof value === 'string' && dateTimeRegExp.test(value)){
        return new Date(value);
    } else{
        return value;
    }
}

function enableCORS(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
}

function handleUnexpectedError(err, req, res, next){
    console.log('An unexpected error occured', err);

    res.status(500).send({message:'An error has occurred please try again. if the error continues please contact support'});
}

const openHttpConnection = {};