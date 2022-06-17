const fs = require('fs');
const file = 'messages.json';

function getMessages() {
  const text = fs.readFileSync(file);
  return JSON.parse(text);
}

function saveMessages(arr) {
  const text = JSON.stringify(arr, null, 2);
  fs.writeFileSync(file, text);
}

module.exports = {
  getMessages,
  saveMessages
};
