const express = require('express');
const fs = require('fs');
const pdf = require('html-pdf');
const bodyParser =require('body-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path =require('path');
const port = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get("/getData", function (req, res) {
    let data = fs.readFileSync('./data.json', 'utf-8');
    data = JSON.parse(data);//111
    res.send(data);
})

app.post("/createReport", function (req, res) {
    let data = fs.readFileSync('./data.json', 'utf-8');
    data = JSON.parse(data);//111
    let tableValue = '';
    data.map((element) => {
        tableValue +=
            `<tr>
                <td>${element.name}</td>
                <td>${element.created}</td>
                <td>${element.predicted}</td>
            </tr>`
    })
    let options =
    {
        format: 'A4',
        header: {
            height: '32px'
        },
        footer: {
            height: '32px',
            contents: {
                default: '<div style="text-align:right">{{page}} of {{pages}}</div>'
            }
        }
    };
    let html = `<html><body><table>
        <thead>
        <tr>
            <th>Dish Name</th>
            <th>Produced</th>
            <th>Predicted</th>
        </tr>
        </thead>
        <tbody>
        ${tableValue}
        </tbody>
    </table></body></html>`
    pdf.create(html, options).toStream(function (err, stream) {
        if (err) return res.send(err);
        stream.pipe(res);
    })
})
app.post("/doneData", function (req, res) {
    let newDetails = req.body;
    console.log("newDetails", newDetails);
    let data = fs.readFileSync('./data.json', 'utf-8');
    data = JSON.parse(data);
    console.log("data", data);
    for (let d = 0; d < data.length; d++) {
        if (data[d].name == newDetails[0].name) {
            let oldCreated = parseInt(data[d].created);
            let newQuantity = parseInt(newDetails[0].quantity)
            oldCreated += newQuantity;
            data[d].created = oldCreated.toString();
        }
    }
    fs.writeFile("data.json", JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log("done data");
    })
    res.send(data);
    res.end();
});

app.post("/insertPredictedValue", function (req, res) {
    let predictedData = req.body;
    let data = fs.readFileSync('./data.json', 'utf-8');
    data = JSON.parse(data);
    for (let i = 0; i < data.length; i++) {
        if (predictedData.id == data[i].id) {
            data[i].predicted = predictedData.predictedValue
        }
    }
    fs.writeFile("data.json", JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log("Inserted");
    })
    res.end();

})

io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
      console.log('client is subscribing to timer with interval ', interval);
      
      setInterval(() => {
        let data =fs.readFileSync('./data.json','utf-8');
        data = JSON.parse(data);
        client.emit('timer', data);
      }, interval);
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

server.listen(port, function () {
    console.log(`Listning to port ${port}`);
}
);

