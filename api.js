const database = require('./database');

const mainRoute = (req, res) => {
  res.sendFile(__dirname + '/index.html');
};

const getMessagesAll = (req, res) => {
  const messages = database.getMessages();
  res.send(messages);
};

const getMessagesById = (req, res) => {
  const messages = database.getMessages();
  const id = Number(req.params.messageId);
  const message = messages.find((message) => message.id === id);
  res.send(message);
};

// LEVEL 3.1
const getMessageByQuery = (req, res) => {
  const messages = database.getMessages();
  queryWord = req.query.text.toLowerCase();
  const search = messages.filter((message) => message.text.toLowerCase().includes(queryWord));
  res.send(search);
};

// LEVEL 3.2
const getMessagesLatest = (req, res) => {
  const messages = database.getMessages();
  const latest = messages.slice(-10);
  res.send(latest);
};

// LEVELS 1 y 2
const postMessage = (req, res) => {
  const messages = database.getMessages();
  if (req.body.text && req.body.from) {
    const newMessage = req.body;
    //  const lastMessageId = Number(messages[messages.length - 1].id); // buscaba el ultimo id, ahora en la siguiente linea busco el id mas alto
    const maxMessageId = Math.max.apply(null, messages.map((message) => message.id));
    newMessage.timeSent = new Date(); // LEVEL 4
    newMessage.id = maxMessageId + 1;
    messages.push(newMessage);
    database.saveMessages(messages);
    res.send('Your message has been sent!');
  } else {
    res.status(400);
    res.send('Your message has not been sent!');
  }
};

// LEVEL 5
const putMessageUpdate = (req, res) => {
  const messages = database.getMessages();
  const id = Number(req.params.messageId);
  const message = messages.find((message) => message.id === id);
  if (message) {
    message.text = req.body.text;
    message.from = req.body.from;
    database.saveMessages(messages);
    res.send({
      status: 'Your message has been modified!',
      data: message
    });
  } else {
    res.status(400);
    res.send('Your message id does not exist, nothing has been modified!');
  }
};

const deleteMessage = (req, res) => {
  let messages = database.getMessages();
  const id = Number(req.params.messageId);
  const deletedMessage = messages.find((message) => message.id === id);
  if (deletedMessage) {
    messages = messages.filter((message) => message.id !== id);
    database.saveMessages(messages);
    res.send({
      status: 'Your message has been deleted!',
      data: deletedMessage
    });
  } else {
    res.status(400);
    res.send('Your message id does not exist, nothing has been deleted!');
  }
};

module.exports = {
  mainRoute,
  getMessagesAll,
  getMessagesById,
  getMessageByQuery,
  getMessagesLatest,
  postMessage,
  putMessageUpdate,
  deleteMessage
};
