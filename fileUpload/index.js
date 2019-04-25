const express = require('express');
const app = express();
const client = require('mongodb').MongoClient;
const fileUpload = require('express-fileupload');
const csvtojson = require('csvtojson');

const port = 3000;
app.listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}`));

let dbPromise = null;
const getDb = () => dbPromise || (dbPromise = client.connect("mongodb://localhost:27017/file-upload", { useNewUrlParser: true }).then((cl) => cl.db()));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp'
}));
app.use(express.static('public'));

app.post('/upload', async (req, res) => {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded');
    }

    let file = req.files.csv;

    const collection = (await getDb()).collection('files');
    const jsonObj = await csvtojson().fromFile(file.tempFilePath);
    console.log(jsonObj);

    await jsonObj.map(async (obj) => {
        await collection.insertOne(obj);
    });

    return res.status(200);
});

app.get('/top', async (req, res) => {
    const amount = parseInt(req.query.top);
    const field = req.query.field;

    const collection = (await getDb()).collection('files');
    const result = await collection.find().sort({[field]: -1}).limit(amount).toArray();

    console.log(amount, field, result);
    if (result) {
        res.send(result);
    }
});
