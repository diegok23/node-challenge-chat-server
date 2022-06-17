const express = require("express");
const cors = require('cors');
const app = express();
const api = require("./api")
const bodyParser = require('body-parser'); //Añadido e instalado para leer desde el body


// AUX FUNCTIONS

const myLogger = (req, res, next) => {
  const log = {
    date: new Date(),
    url: req.url
  };
  console.log(JSON.stringify(log, null, 2));
  next();
};

app.use(myLogger);
app.use(express.json());
app.use(bodyParser.json()); //Añadido e instalado para leer desde el body
app.use(bodyParser.urlencoded({ extended: false })); //Añadido e instalado para leer desde el body
app.use(cors());
app.get('/', api.mainRoute);
app.get('/messages', api.getMessagesAll);
app.get('/messages/search/', api.getMessageByQuery);
app.get('/messages/latest', api.getMessagesLatest);
app.get('/messages/:messageId', api.getMessagesById);
app.post('/messages', api.postMessage);
app.put('/messages/:messageId', api.putMessageUpdate);
app.delete('/messages/:messageId', api.deleteMessage);


const port = 3000;
const url = `http://localhost:${port}/`;
app.listen(port, () => console.log(`Listening on port ${url}`));
