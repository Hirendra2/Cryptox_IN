const port = process.env.PORT || 6000;
const express = require("express");
var ethers = require("ethers");
var url = "https://cinscan.cryptoxin.com";
require("dotenv").config();
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const multer = require("multer");
const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const dirPath = path.join(__dirname, "images");
const abi = fs.readFileSync("./abis/cryabi.json", "utf-8");

const createPost = async (
  myAddress,
  privateKey,
  _hashtag,
  _content,
  _imghash,
  videoHash
) => {
  return new Promise(async (resolve, reject) => {
    //console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    //console.log(`num transactions so far: ${count}`);

    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.CONTRACT_ADDRESS,
      {
        from: myAddress,
      }
    );

    
    var gasPriceGwei = 100;
    //console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 6599999;
    //console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods
        .createPost(_hashtag, _content, _imghash, videoHash)
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
        sentTx.on("receipt", async (receipt) => {
          console.log(
            "************ https://fufiscan.com/tx/" + receipt.transactionHash
          );
          eventreward(myAddress, 700, "post", "", "", "").then(async (r) => {
            console.log("posttttttttt");
          });
          re1 = { status: true, msg: receipt.transactionHash };
        

          return resolve(re1);
          //res.status(201).send({ status: true, msg: receipt.transactionHash });
        });
        sentTx.on("error", (err) => {
          console.log("11111111111111111111", err);
          let response = { status: false, msg: "Failed" };
          return reject(response);
          //res.status(404).send({ status: false, msg: "Failed" });
        });
      })
      .catch((err) => {
        console.log("2222222222222", err);
        let response = { status: false, msg: "Failed" };
        return reject(response);
      });
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
        
          return resolve(re1);

          // res.status(201).send({ status: true, msg: receipt.transactionHash });
        });
        sentTx.on("error", (err) => {
         // console.log(err);
          let response = { status: false, msg: "Failed" };
          return reject(response);
          // res.status(404).send({ status: false, msg: "Failed" });
        });
      })
      .catch((err) => {
     //   console.log(err);
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
  
    return resolve(getrankdetail);
  });
};

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors());
app.use("/images", express.static("./images"));

// let count;
// const storage = multer.diskStorage({

//   destination: function (req, file, callback) {
//     callback(null, __dirname + "/images");
//   },
//   filename: function (req, file, callback) {
//     callback(null, (count++)+file.originalname);
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
      callback(null, __dirname + '/images');
  },
  filename: function (req, file, callback) {
      callback(null, `${Date.now()+"."+ file.originalname.split(".")[1]}`);
      console.log("hhh",file.originalname.split(".")[1]);
  }
});


const upload = multer({ storage: storage });
app.post("/upload", upload.array("file"), (req, res) => {
   
 

  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var _hashtag = req.body._hashtag;
  var _content = req.body._content;
  var videoHash = req.body.videoHash;
  var type = req.body.type;
 

 //console.log("pppppppp",myAddress)
  var s = " ";
  const array = req.files;
 console.log("NEW POST >>>>>>>>>>>")
  for (let x = 0; x < array.length; x++) {
    let _imghashs = "http://165.232.181.8:6000/images/";
    s += _imghashs + array[x].filename + "*";
  }
  if (type == "1") {
    let Profileimgg = s;
    console.log(Profileimgg);
    getprofiless(myAddress).then(async (r) => {
     // console.log("getprofiless***********", r);
     let Name =r.Name;
     let Organization= r.Organization;
     let designation= r.designation;
     let Dob= r.Dobss;
     let ProfileTag= r.ProfileTag;
     let MailID= r.MailID;
     let Otherdetail= r.Otherdetail;
     let backgroundimgg= r.backgroundimgg;

     
    updateprofileimg(myAddress, privateKey,Name,Organization,designation,Dob,ProfileTag,MailID,Otherdetail,Profileimgg,backgroundimgg)
      .then(async (re) => {
        console.log("updateprofileimg***********", re);
        res.status(201).send(re);
      })
      .catch((e) => {
     //   console.log("updateprofileimgeeeeeeeee", e);
      });
    }) .catch((e) => {
    //  console.log("eeeeeegetprofiless", e);
    });
  } else if (type == "2") {
    let backgroundimgg = s;
    console.log(backgroundimgg);
    getprofiless(myAddress).then(async (r) => {
   //   console.log("getprofiless***********", r);
     let Name =r.Name;
     let Organization= r.Organization;
     let designation= r.designation;
     let Dob= r.Dobss;
     let ProfileTag= r.ProfileTag;
     let MailID= r.MailID;
     let Otherdetail= r.Otherdetail;
     let Profileimgg= r.Profileimgg;

    updatebackgroundimgg(myAddress, privateKey,Name,Organization,designation,Dob,ProfileTag,MailID,Otherdetail,Profileimgg,backgroundimgg)
      .then(async (re) => {
//console.log("updatebackgroundimgg***********", re);
        res.status(201).send(re);
      })
      .catch((e) => {
     //   console.log("updatebackgroundimggeeeeeeeee", e);
      });
    }).catch((e) => {
   //   console.log("eeeegetprofiless", e);
    });
  }else if(type == "3"){
    let _imghash="0"
    createPost(myAddress, privateKey, _hashtag, _content, _imghash,videoHash)
      .then(async (re) => {
      //  console.log("createPost***********", re);
        res.status(201).send({ msg:re });
      })
      .catch((e) => {
     //   console.log("createPosteeeeeeee", e);
      });
  }  else if(type == "4"){
    let _imghash = s;
    console.log(_imghash);
    let videoHash="0"
    createPost(myAddress, privateKey, _hashtag, _content, _imghash,videoHash)
      .then(async (re) => {
        console.log("createPost***********", re);
     
        res.status(201).send(re);
      })
      .catch((e) => {
        console.log("createPosteeeeeeee", e);
      });
  }
  else if(type == "5"){
    let videoHash = s;
    console.log(videoHash);
    let _imghash = " ";

    createPost(myAddress, privateKey, _hashtag, _content, _imghash,videoHash)
      .then(async (re) => {
      //  console.log("createPost***********", re);
     
        res.status(201).send({ status: true, msg: re });
      })
      .catch((e) => {
        console.log("createPosteeeeeeee", e);
      });
  }
});

app.get("/", (req, res) => {
  fs.readdir(dirPath, (err, images) => {
    return res.send(images);
  });
});

app.delete("/", (req, res) => {
  let fileName = req.query.fileName;
  console.log(fileName);
  const directoryPath = `images/${fileName}`;
  console.log(directoryPath);
  try {
    fs.unlinkSync(directoryPath);

    res.status(200).send({
      message: "File is deleted.",
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err,
    });
  }
});

app.listen(port, () => console.log(`${port}`));


async function eventreward(
  myAddress,
  reward,
  types,
  tofullname,
  byname,
  touseraddress
) {
  return new Promise(async function executor(resolve, reject) {
    var data = JSON.stringify({
      address: myAddress,
      reward: reward,
      type: types,
      tofullname: tofullname,
      byname: byname,
      touseraddress: touseraddress,
    });
    console.log("**********SENDING REQUEST TO NEXT SERVER ***********", data);
    var config = {
      method: "post",
      url: "https://reward.cryptoxin.com/eventReward",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then((res) => {
        //console.log("Postttttttt");
      })
      .catch(function (error) {
        //console.log("errorPostttttttt");
      });
  });
}