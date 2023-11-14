var ethers = require("ethers");
var url = "https://fufi.finance/rpc";

require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/fufisend.json", "utf-8");

const {
  loginLogger,
  postLogger,
  errorLogger,
  bonusLogger,
  rewardLogger,
  referralLogger,
  followLogger,
  burnLogger,
} = require("./middlewares/logger");

async function Fufisendburn(myAddress) {
  var privateKey = process.env.FUFIprivateKey;
  var OwnerAddress = process.env.FUFIAddress;

  return new Promise(async (resolve, reject) => {
    console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);

    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.FUFI_CONTRACT_ADDRESS,
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
      to: process.env.FUFI_CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.fufisend(myAddress).encodeABI(),
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
          re1 = { status: true, msg: receipt.transactionHash };
          burnLogger.log({
            level: "info",
            message: {
              task: "Fufisendburn",
              request: myAddress,
              response: receipt.transactionHash,
            },
          });
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

async function cinclaim(myAddress) {
  return new Promise(async function executor(resolve, reject) {
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.FUFI_CONTRACT_ADDRESS
    );
    await contract.methods
      .userList(myAddress)
      .call()
      .then(async (re) => {
        console.log(re);
        burnLogger.log({
          level: "info",
          message: {
            task: "cinclaim",
            request: myAddress,
            response: re,
          },
        });
        return resolve(re);
      })
      .catch((e) => {
        console.log("polyganbal", e);
        return reject(e);
      });
  });
}

const withs = async (req, res, next) => {
  var privateKey = process.env.REFERRALprivateKey;
  var OwnerAddress = process.env.REFERRALAddress;
  var amt = req.body.amt;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(OwnerAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS,
    {
      from: OwnerAddress,
    }
  );

  var amounts = web3.utils.toWei(amt, "ether");
  var gasPrices = await getCurrentGasPrices();
  var gasPriceGwei = gasPrices.low;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: OwnerAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.REFERRAL_CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.updatereferral(amounts).encodeABI(),
  };
  console.log(
    `Raw of Transaction: \n${JSON.stringify(rawTransaction, null, "\t")}\n--`
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

        burnLogger.log({
          level: "info",
          message: {
            task: "Transaction_withs",
            request: amt,
            response: receipt.transactionHash,
          },
        });

        res.status(201).send({ status: true, msg: receipt.transactionHash });
      });
      sentTx.on("error", (err) => {
        console.log(err);
        res.status(404).send({ status: false, msg: "Failed" });
      });
    })
    .catch((err) => {
      console.log(err);
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
  Fufisendburn,
  withs,
  cinclaim,
};
