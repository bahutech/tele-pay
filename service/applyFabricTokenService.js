const config = require("../config/config");
var request = require("request");

function applyFabricToken() {
  console.log("AM AT applyFabricToken");
  return new Promise((resolve, reject) => {
    var options = {
  'method': 'POST',
  'url': 'https://196.188.120.3:38443/apiaccess/payment/gateway/payment/v1/token',
  'headers': {
    'X-APP-Key': 'c4182ef8-9249-458a-985e-06d191f4d505',
    'Content-Type': 'application/json'
  },
  'mode': 'cors',
  body: JSON.stringify({
    "appSecret": "fad0f06383c6297f545876694b974599"
  })

};
request(options, function (error, response) {
  //if (error) throw new Error(error);
    console.log(response);
    console.log("***********");
       //console.log("BODY", response.body);
      // console.log(typeof response.body);
     let result = JSON.parse(response.body);
      //console.log(result);
      console.log("*****************");
      resolve(result);
});
  });
}

module.exports = applyFabricToken;

// const https = require("http");
// const config = require("../config/config");
// var request = require("request");

// // Apply fabric token
// function applyFabricToken() {
//   return new Promise((resolve, reject) => {
//     var options = {
//       method: "POST",
//       url: config.baseUrl + "/payment/v1/token",
//       headers: {
//         "Content-Type": "application/json",
//         "X-APP-Key": config.fabricAppId,
//       },
//       rejectUnauthorized: false, //add when working with https sites
//       requestCert: false, //add when working with https sites
//       agent: false, //add when working with https sites
//       body: JSON.stringify({
//         appSecret: config.appSecret,
//       }),
//     };
//     console.log(options);
//     request(options, function (error, response) {
//       // if (error) throw new Error(error);
//       // console.log("***********");
//       console.log("BODY", response.body);
//       // console.log(typeof response.body);
//       let result = JSON.parse(response.body);
//       // console.log(result);
//       // console.log("*****************");
//       resolve(result);
//     });
//   });
// }

// module.exports = applyFabricToken;
