const EthereumTx = require("ethereumjs-tx").Transaction;
var Web3 = require("web3");
var url = "https://cinscan.cryptoxin.com";
const fs = require("fs");
const axios = require("axios");
const web3 = new Web3(Web3.givenProvider || url);
var mongoUtil = require("./dbconfigsid.js");  
let myAddress =process.env.REFERRALAddress
let privKey =process.env.REFERRALprivateKey
const abi2 = fs.readFileSync("./abis/referral.json", "utf-8");

// mongoUtil.connectToServer(async function (err, client) {
  
//   if (err) {
//     console.log(err);
//   } else {
//     db = mongoUtil.getDb();
//     console.log(db)
//     db.collection("remaining").find().toArray(async function (err, result) {
//       if (err) throw err;
//       console.log("result",result);
//           result.forEach(async (element, index) => {
//             let dd =element.abidata
//             await sleep(20000 * index);
//             console.log("indexxxxxx",index+1);
//            // await sleep(20000)
//            console.log("parent",element.parent ,"child",element.child);
//           //   await  cinreferral(myAddress,element.parent ,element.child, privKey).then(async (r) => {
//           //     console.log("cinreferral***********", r);
//           //   })
//           //   .catch((e) => {
//           //     console.log("eeeeeeecinreferral", e);
//           //     db.collection("false").insertOne(dd);
//           //    // res.status(404).send({ status: false, msg: false });
//           //   });
//           });
    
//       });
//   }
// });




const getnewData = () => {
  mongoUtil.connectToServer(async function (err, client) {
    if (err) {
      console.log(err);
    } else {
      db = mongoUtil.getDb();
      // console.log(db);
      await sleep(200);
      await db
        .collection("remaining")
        .find({})
        .toArray(async function (err, result) {
          if (err) throw err;
          console.log(result.length);

          await result.forEach(async (x) => {
            console.log(x.abidata);
          });
        });
    }
  });
};

getnewData()

const cinreferral = async ( myAddress,parent,child, privKey) => {
    return new Promise(async (resolve, reject) => {
      console.log(`web3 version: ${web3.version}`);
      var count = web3.eth.getTransactionCount(myAddress);
      console.log(`num transactions so far: ${count}`);
      let CONTRACT_ADDRESS="0x3C22957eac515F75bd0f8035496195F2Ca925230";
      const abiArray = JSON.parse(abi2);
      var contract = new web3.eth.Contract( abiArray, CONTRACT_ADDRESS,{from: myAddress});
  
      var gasPrices = await getCurrentGasPrices();
      var gasPriceGwei = 100;
      console.log("gasPriceGwei", gasPriceGwei);
      var gasLimit = 6599999;
      console.log("gasLimit", gasLimit);
  
      var rawTransaction = {
        from: myAddress,
        gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
        gasLimit: web3.utils.toHex(gasLimit),
        to:CONTRACT_ADDRESS,
        value: "0x0",
        data: contract.methods
          .ownerreferral(parent,child)
          .encodeABI(),
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
        privKey
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
  
            // res.status(201).send({ status: true, msg: receipt.transactionHash });
          });
          sentTx.on("error", (err) => {
            console.log(err);

           // let response =receipt.transactionHash;
            return reject(err);
            // res.status(404).send({ status: false, msg: "Failed" });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };




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