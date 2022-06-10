const express = require('express');
const cors = require('cors');
const fs = require('fs');
const file = 'messages.json';
const app = express();
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

function getMessages() {
  const text = fs.readFileSync(file);
  return JSON.parse(text);
}

function saveMessages(arr) {
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
}

/* DEPRECATED

const welcomeMessage = {
  id: 0,
  from: 'Bart',
  text: 'Welcome to CYF chat system!'
};
let messages = [welcomeMessage];
 */
//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.

const mainRoute = (req, res) => {
  res.sendFile(__dirname + '/index.html');
};

const getMessagesAll = (req, res) => {
  const messages = getMessages();
  res.send(messages);
};

const getMessagesById = (req, res) => {
  const messages = getMessages();
  //const messages = getMessages();
  const id = Number(req.params.messageId);
  const message = messages.find((message) => message.id === id);
  res.send(message);
};

// LEVEL 3.1
const getMessageByQuery = (req, res) => {
  const messages = getMessages();
  queryWord = req.query.text.toLowerCase();
  const search = messages.filter((message) => message.text.toLowerCase().includes(queryWord));
  res.send(search);
};

// LEVEL 3.2
const getMessagesLatest = (req, res) => {
  const messages = getMessages();
  const latest = messages.slice(-10);
  res.send(latest);
};

// LEVELS 1 y 2
const postMessage = (req, res) => {
  const messages = getMessages();
  if (req.body.text.length > 0 && req.body.from.length > 0) {
    const newMessage = req.body;
    const lastMessageId = Number(messages[messages.length - 1].id);
    newMessage.timeSent = new Date(); // LEVEL 4
    newMessage.id = lastMessageId + 1;
    messages.push(newMessage);
    saveMessages(messages);
    res.send('Your message has been sent!');
  } else {
    res.status(400);
    res.send('Your message has not been sent!');
  }
};

// LEVEL 5
const putMessageUpdate = (req, res) => {
  const messages = getMessages();
  const id = Number(req.params.messageId);
  const message = messages.find((message) => message.id === id);
  if (message) {
    message.text = req.body.text;
    message.from = req.body.from;
    saveMessages(messages);
    res.send({
      status: 'Your message has been modified!',
      data: message
    });
  } else {
    res.status(400);
    res.send('Your message has not been modified!');
  }
};

const deleteMessage = (req, res) => {
  let messages = getMessages();
  const id = Number(req.params.messageId);
  const deletedMessage = messages.find((message) => message.id === id);
  if (deletedMessage) {
    messages = messages.filter((message) => message.id !== id);
    saveMessages(messages);
    res.send({
      status: 'Your message has been deleted!',
      data: deletedMessage
    });
  } else {
    res.status(400);
    res.send('Your message has not been deleted!');
  }
};
//

app.use(myLogger);
app.use(express.json());
app.use(bodyParser.json()); //Añadido e instalado para leer desde el body
app.use(bodyParser.urlencoded({ extended: false })); //Añadido e instalado para leer desde el body
app.use(cors());
app.get('/', mainRoute);
app.post('/messages', postMessage);
app.put('/messages/:messageId', putMessageUpdate);
app.get('/messages', getMessagesAll);
app.get('/messages/search/', getMessageByQuery);
app.get('/messages/latest', getMessagesLatest);
app.get('/messages/:messageId', getMessagesById);
app.delete('/messages/:messageId', deleteMessage);
//

const port = 3000;
const url = `http://localhost:${port}/`;
app.listen(port, () => console.log(`Listening on port ${url}`));
