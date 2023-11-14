var ethers = require("ethers");
var url = "https://cinscan.cryptoxin.com";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);

const abi = fs.readFileSync("./abis/cryabi.json", "utf-8");
var myAddresss = process.env.OwnerAddress;
var privateKey =process.env.privateKey ;
let aa = 0;
const getData = async (aa) => {
  return new Promise(async function executor(resolve, reject) {
  let data = JSON.stringify({
    index: aa,
  });
  var config = {
    method: "post",
    url: "http://localhost:8555/getUser1",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

    await axios(config).then(async function (response) {
      let address = response.data.data;
      console.log("rrrr", address);
      await getparent(address).then(async (r) => {
          const propertyaddress = Object.values(r);
          await makeTransaction(propertyaddress, aa).then((res) => {
              console.log("FINALRES", res);
              return resolve("success"); 
            }).catch((err) => {
              console.log("LLLLLLLLLLL", err);
              return reject("reject"); 
            });
        }).catch((e) => {
          console.log("eeeeee", e);
          return reject("reject"); 
        });
    }).catch(function (error) {
      console.log(error);
    });
  });
};

async function makeTransaction(propertyaddress, aa) {
  return new Promise(async function executor(resolve, reject) {
    let index = propertyaddress.slice();
    console.log("Parentaddress", index);
    let chaild = "0x57c81C361C62F1E9Ba4b3aE5EE8F162b610B579b";
    let response;
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract( abiArray, process.env.CONTRACT_ADDRESS,{
        from: myAddresss,
      }
    );
    var gasPrices = await getCurrentGasPrices();
    var gasPriceGwei = 100;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 6599999;
    console.log("gasLimit", gasLimit);
    var rawTransaction = {
      from: myAddresss,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.parentrewards(chaild, index, "1").encodeABI(),
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
    signPromise.then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(
          signedTx.raw || signedTx.rawTransaction
        );
        sentTx.on("receipt", async (receipt) => {
          console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
          aa++
          return resolve(receipt.transactionHash);
        });
        sentTx.on("error", (err) => {
          console.log(err);
          response = { status: false, message: err };
          return reject(response);
        });
      }).catch((err) => {
        console.log(err);
        response = { status: false, message: err };
        return reject(response);
      });
  });
}

async function getparent(myAddress) {
  return new Promise(async function executor(resolve,reject) {
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.CONTRACT_ADDRESS,
      { from: myAddress }
    );
    var getUsers = await contract.methods.getparentss(myAddress).call();
    console.log(getUsers);
    return resolve(getUsers);
  })
}


async function ggggg(){
  for(let i=0; i < 5; i++){
    await sleep(i*200); 
    console.log("JHJHH",i); 
    await getData(i).then((re)=>{
      console.log("**********************",re);
    }); 
  }
  
}

ggggg();




async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
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
