var ethers = require("ethers");
var url = "https://cinscan.cryptoxin.com";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/cryabi.json", "utf-8");


const ownerdeletePost = async (req, res, next) => {
    var myAddress = req.body.myAddress;
    
    console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);
  
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
      from: myAddress,
    });

  
    var gasPrices = await getCurrentGasPrices();
    var gasPriceGwei = gasPrices.low; 
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);
  
    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.ownerdeletePost(PostId).encodeABI(),
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


  async function Fufisendburn(myAddress) {
    var privateKey = process.env.privateKey;
    var OwnerAddress = process.env.OwnerAddress;
  
    return new Promise(async (resolve, reject) => {
      console.log(`web3 version: ${web3.version}`);
      var count = web3.eth.getTransactionCount(myAddress);
      console.log(`num transactions so far: ${count}`);
  
      const abiArray = JSON.parse(abi2);
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
    ownerdeletePost}