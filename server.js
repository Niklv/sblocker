var env = process.env;
var express = require('express');
var app = express();

app.get("/rules", function(req, res){
    res.json({
        "rules": [
            {
                "id": 1,
                "type": "block",
                "number": "89165798450",
                "reason": "spam",
                "description": "Шлюз рассылки спам сообщений",
                "date": 1382363014323
            },
            {
                "id": 2,
                "type": "block",
                "number": "Kupi_Avto",
                "reason": "thief",
                "description": "Заблокирован из-за мошенничества с покупкой автомобилей",
                "date": 1382363030386
            },
            {
                "id": 3,
                "type": "allow",
                "number": "900",
                "reason": "bank-info number",
                "description": "Номер шлюза сообщений сбербанка",
                "date": 1382363201109
            }
        ]
    });
});

app.configure("production", function () {
    app.listen(20300);
    console.log("Listen on 20300!");
});

app.configure("development", function () {
    app.listen(20301);
    console.log("Listen on 20301!");
});