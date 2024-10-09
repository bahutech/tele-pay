const express = require("express");
const bodyParser = require("body-parser");
var app = express();
const { signString } = require("./utils/tools");
const authToken = require("./service/authTokenService");
const createOrder = require("./service/createOrderService");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// allow cross-origin
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PATCH, PUT, DELETE"
  );
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");
  next();
});

app.post("/apply/h5token", function (req, res) {
  authToken.authToken(req, res);
});

app.post("/create/order", function (req, res) {
  console.log("server Receive Order :" + req);
  createOrder.createOrder(req, res);
});

//for testing
// app.get("/api/listen", (req, res) => {
//   res.status(200).json({ reqRes: "Send the data" });
// });

app.post("/api/v1/notify", (req, res) => {
  console.log("Notify Response Hits HERE!");
  // console.log({ REQ_BODY: req });
  res.status(201).json({ body: req.body });
});

app.put("/api/v1/notify", (req, res) => {
  console.log("New Notify Response Body Hit PUT");
  console.log({ REQ_BODY: req.body });
  res.status(201).json({ body: req.body });
});
// start server
let serverPort = process.env.PORT | 8081;
var app = app.listen(serverPort, function () {
  console.log("server started, port:" + serverPort);
});
