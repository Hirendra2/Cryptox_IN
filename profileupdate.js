var ethers = require("ethers");
var url = "https://cinscan.cryptoxin.com";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/cryabi.json", "utf-8");

const {
  loginLogger,
  postLogger,
  errorLogger,
  bonusLogger,
  rewardLogger,
  referralLogger,
  followLogger,
} = require("./middlewares/logger");

const profileupdate = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var Name = req.body.Name;
  var Organization = req.body.Organization;
  var designation = req.body.designation;
  var Dob = req.body.Dob;
  var ProfileTag = req.body.ProfileTag;
  var MailID = req.body.MailID;
  var Otherdetail = req.body.Otherdetail;
  var Profileimgg = req.body.Profileimgg;
  var backgroundimgg = req.body.backgroundimgg;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

   
  var gasPriceGwei =  53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods
      .updeteprofile(
        Name,
        Organization,
        designation,
        Dob,
        ProfileTag,
        MailID,
        Otherdetail,
        Profileimgg,
        backgroundimgg
      )
      .encodeABI(),
  };

  
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

        postLogger.log({
          level: "info",
          message: {
            task: "Profile_update",
            request: req.body,
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

const User = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

   
  var gasPriceGwei =  53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.User().encodeABI(),
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

        postLogger.log({
          level: "info",
          message: {
            task: "User",
            request: req.body,
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

const getprofiles = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);

  var getrankdetail = await contract.methods.profiles(myAddress).call();
  console.log("getprofiles");
  let profiless = getrankdetail.Profileimgg;
  var string = (profiless).split("*");
  let noEmptyStrings = string.filter((str) => str !== '*');
  let backgroundimgg = getrankdetail.backgroundimgg;
  var stringss = (backgroundimgg).split("*");
  let noEmptyStrings2 = stringss.filter((str) => str !== '*');
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh",noEmptyStrings[0]);
    let img = noEmptyStrings[0]
    let backgroundimggss = noEmptyStrings2[0]
    getrankdetail.Profileimgg = img
    getrankdetail.backgroundimgg = backgroundimggss
    res.status(201).send({ status: true, data: getrankdetail });
    postLogger.log({
      level: "info",
      message: {
        task: "getProfileRank",
        request: req.body,
        response: getrankdetail,
      },
    });

  

};

const updateprofileimg = async (
  myAddress,
  privateKey,
  Name,
  Organization,
  designation,
  Dob,
  ProfileTag,
  MailID,
  Otherdetail,
  Profileimgg,
  backgroundimgg
) => {
  return new Promise(async (resolve, reject) => {
    console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);

    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.CONTRACT_ADDRESS,
      {
        from: myAddress,
      }
    );

     
    var gasPriceGwei =  53;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods
        .updeteprofile(
          Name,
          Organization,
          designation,
          Dob,
          ProfileTag,
          MailID,
          Otherdetail,
          Profileimgg,
          backgroundimgg
        )
        .encodeABI(),
    };
    
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

          // postLogger.log({
          //   level: "info",
          //   message: {
          //     task: "Update_ProfileImage",
          //     request: req.body,
          //     response: receipt.transactionHash,
          //   },
          // });

          return resolve(re1);

          // res.status(201).send({ status: true, msg: receipt.transactionHash });
        });
        sentTx.on("error", (err) => {
          console.log(err);
          let response = { status: false, msg: "Failed" };
          return reject(response);
          // res.status(404).send({ status: false, msg: "Failed" });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const updatebackgroundimgg = async (
  myAddress,
  privateKey,
  Name,
  Organization,
  designation,
  Dob,
  ProfileTag,
  MailID,
  Otherdetail,
  Profileimgg,
  backgroundimgg
) => {
  return new Promise(async (resolve, reject) => {
    console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);

    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.CONTRACT_ADDRESS,
      {
        from: myAddress,
      }
    );

     
    var gasPriceGwei =  53;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods
        .updeteprofile(
          Name,
          Organization,
          designation,
          Dob,
          ProfileTag,
          MailID,
          Otherdetail,
          Profileimgg,
          backgroundimgg
        )
        .encodeABI(),
    };
    
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
          // postLogger.log({
          //   level: "info",
          //   message: {
          //     task: "Update_BackGImage",
          //     request: req.body,
          //     response: receipt.transactionHash,
          //   },
          // });
          return resolve(re1);

          // res.status(201).send({ status: true, msg: receipt.transactionHash });
        });
        sentTx.on("error", (err) => {
          console.log(err);
          let response = { status: false, msg: "Failed" };
          return reject(response);
          // res.status(404).send({ status: false, msg: "Failed" });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const getprofiless = async (myAddress) => {
  return new Promise(async (resolve, reject) => {
    console.log(`web3 version: ${web3.version}`);
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.CONTRACT_ADDRESS
    );

    var getrankdetail = await contract.methods.profiles(myAddress).call();
    // console.log(getrankdetail);
    // postLogger.log({
    //   level: "info",
    //   message: {
    //     task: "ProfileRank2",
    //     request: req.body,
    //     response: getrankdetail,
    //   },
    // });
    return resolve(getrankdetail);
  });
};

const getUserCount = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);

   
  var gasPriceGwei =  53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var getUserCount = await contract.methods.getUserCount().call();

  postLogger.log({
    level: "info",
    message: {
      task: "getUserCount",
      request: "",
      response: getUserCount,
    },
  });
 // console.log(getUserCount);

  res.status(201).send({ status: true, data: getUserCount });
};



module.exports = {
  profileupdate,
  getprofiles,
  User,
  getUserCount,
  updateprofileimg,
  updatebackgroundimgg,
  getprofiless,
};
