const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Verificación del Webhook con Facebook
app.get("/webhook", (req, res) => {
  let VERIFY_TOKEN = "ccgtokensecreto"; // importante
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Responder a mensajes en Messenger
app.post("/webhook", (req, res) => {
  let body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      let event = entry.messaging[0];
      let sender = event.sender.id;

      if (event.message) {
        let message = event.message.text;
        sendMessage(sender, `Recibí tu mensaje: ${message}`);
      }
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Enviar respuesta a Messenger
const PAGE_ACCESS_TOKEN = "EAAdLrRlBgpIBO7Q8DdcsSRMquqfUI6zhy4ZCNs3ptL4186bJergKiZCToA8SgMEsIXqv6o0BPWb9d5vxiCbZBM2HbugVBcsKTvIFRMHNpBBgmukpGjCewscIdt2Y4OdwqjZBsCPIS1MHcUM0ZBgwA6W0ahZBA3X2hZBrK8HGPEDBLXquUx0NjSqCxRIPaGriDKsVwZDZD"; // Reemplázalo con el token de tu página
const axios = require("axios");

function sendMessage(sender, text) {
  let payload = {
    recipient: { id: sender },
    message: { text: text },
  };

  axios.post(`https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, payload)
    .then(response => console.log("Mensaje enviado"))
    .catch(error => console.log("Error enviando mensaje:", error.response.data));
}

// Exportamos la función para Firebase
exports.webhook = functions.https.onRequest(app);
