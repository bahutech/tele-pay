const applyFabricToken = require("./applyFabricTokenService");
const tools = require("../utils/tools");
const axios = require("axios");
const config = require("../config/config");
const https = require("http");
var request = require("request");

exports.createOrder = async (req, res) => {
	console.log("createOrder called");
	console.log(req.body);
  let title = req.body.title;
  let amount = req.body.amount;
  let applyFabricTokenResult = await applyFabricToken();
  let fabricToken = applyFabricTokenResult.token;
  console.log("fabricToken =", fabricToken);
  let createOrderResult = await exports.requestCreateOrder(
    fabricToken,
    title,
    amount
  );
  console.log(createOrderResult);
  let prepayId = createOrderResult.biz_content.prepay_id;
  let rawRequest = createRawRequest(prepayId);
  //console.log("RAW_REQ: ", rawRequest);
  console.log("RAW_REQ: ");
  console.log(rawRequest);
  //res.send(rawRequest);
  return rawRequest;
};

exports.requestCreateOrder = async (fabricToken, title, amount) => {
	console.log("requestCreateOrder called");
	console.log(title+" "+ amount+" "+fabricToken);
	//let reqObject = await createRequestObject(title, amount);
  try {
    const reqObject = await createRequestObject(title, amount);
    console.log(reqObject);

    const response = await axios.post(
      `${config.baseUrl}/payment/v1/merchant/preOrder`,
      reqObject,
      {
        headers: {
          "Content-Type": "application/json",
          "X-APP-Key": config.fabricAppId,
          Authorization: fabricToken,
        },
      }
    );

    // Assuming your response is a JSON object, no need to parse it
    return response.data;
  } catch (error) {
    console.error("Error while requesting create order:", error.message);
    throw error; // Propagate the error for handling at a higher level
  }
  /* return new Promise((resolve) => {
    

    console.log(reqObject);

    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/merchant/preOrder",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify(reqObject),
    };

    request(options, function (error, response) {
      console.log(error);
      if (error) throw new Error(error);
      console.log(response.body);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  }); */
};

function createRequestObject(title, amount) {
	console.log("createRequestObject called");
	console.log(title+" "+ amount);
  let req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };
  let biz = {
    // notify_url: "https://node-api-muxu.onrender.com/api/v1/notify",
    notify_url: "https://tele-pay.onrender.com/api/v1/notify",
    trade_type: "InApp",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    title: title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
    payee_identifier: config.merchantCode,
    payee_identifier_type: "04",
    payee_type: "5000",
    redirect_url: "https://aliexpress.com.et/success",
  };
  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  console.log(req);
  return req;
}

function createMerchantOrderId() {
  return new Date().getTime() + "";
}

function createRawRequest(prepayId) {
  let map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };
  let sign = tools.signRequestObject(map);
  // order by ascii in array
  let rawRequest = [
    "appid=" + map.appid,
    "merch_code=" + map.merch_code,
    "nonce_str=" + map.nonce_str,
    "prepay_id=" + map.prepay_id,
    "timestamp=" + map.timestamp,
    "sign=" + sign,
    "sign_type=SHA256WithRSA",
  ].join("&");
  console.log("rawRequest = ", rawRequest);
  return rawRequest;
}

// module.exports = createOrder;
