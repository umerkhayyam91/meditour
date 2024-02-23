const firebase = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
        storageBucket: "meditour-33ba8.appspot.com",
  });

  module.exports = {firebase};