var ethers = require("ethers");
var url = "https://cinscan.cryptoxin.com";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/cryabi.json", "utf-8");
const abi2 = fs.readFileSync("./abis/referral.json", "utf-8");
var moment = require("moment");
var service_post = require("./service_post");
var service_users = require("./service_users");
const mongoDB = require("./mongodb");
const { isValid } = require("shortid");

const {
  loginLogger,
  postLogger,
  errorLogger,
  bonusLogger,
  rewardLogger,
  referralLogger,
  followLogger,
} = require("./middlewares/logger");

const ragistration = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  let privateKey = req.body.privateKey;
  let referralcode = req.body.referralcode;
  await Validref(referralcode).then(async (r) => {
    //console.log("Referralragistrations***********", r);
    if (r == true) {
      await Referralragistrations(myAddress, privateKey, referralcode)
        .then(async (r) => {
          //console.log("Referralragistrations***********", r);
          loginLogger.log({
            level: "info",
            message: {
              task: "Registration",
              request: req.body,
              response: r,
            },
          });
          res.status(201).send({ status: true, msg: true });
        })
        .catch((e) => {
          //console.log("Referralcfb", e);
          res.status(404).send({ status: false, msg: false });
        });
    } else if (r == false) {
      res.status(201).send({ status: true, msg: false });
    }
  });
};

async function Referralragistrations(myAddress, privateKey, referralcode) {
  return new Promise(async function executor(resolve, reject) {
    //console.log(`web3 version: ${web3.version}`);
    const abiArray = JSON.parse(abi2);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.REFERRAL_CONTRACT_ADDRESS,
      { from: myAddress }
    );
    
    var gasPriceGwei = 53;
    var gasLimit = 800000;
    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.REFERRAL_CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.referral(referralcode, myAddress).encodeABI(),
    };
    //console.log(
    //  `Raw of Transaction: \n${JSON.stringify(rawTransaction, null, "\t")}\n--`
    // );
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
          Referral(myAddress, referralcode).then(async (r) => {
            //console.log("rrrrrrrrr");
          });
          return resolve(receipt.transactionHash);
        });
        sentTx.on("error", (err) => {
          //console.log(err);
          return reject(err);
        });
      })
      .catch((err) => {
        //console.log(err);
      });
  }).catch((err) => {
    //console.log(err);
  });
}

async function Validref(referralcode) {
  return new Promise(async function executor(resolve, reject) {
    //console.log(`web3 version: ${web3.version}`);
    let abiArray = JSON.parse(abi2);
    let contract = new web3.eth.Contract(
      abiArray,
      process.env.REFERRAL_CONTRACT_ADDRESS
    );
    await contract.methods
      .isuser(referralcode)
      .call()
      .then(async (re) => {
        //console.log(re);
        return resolve(re);
      })
      .catch((err) => {
        //console.log("errrrr", err);
        return reject("err");
      });
  });
}

const DailycheckinBonas = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  let curentdate = moment().format("YYYY-MM-DD");
  let curentdatetime = moment().format("YYYY-MM-DD HH:mm:ss");
  let enddate = moment(curentdate)
    .add(23, "hours")
    .format("YYYY-MM-DD HH:mm:ss");
  let m1 = moment(curentdatetime, "DD-MM-YYYY HH:mm");
  let m2 = moment(enddate, "DD-MM-YYYY HH:mm");
  let m3 = m2.diff(m1, "hours");
  m3 = parseFloat(m3) + 1;
  // let nextelDate = moment(curentdatetime).add(m3, 'hours').format("YYYY-MM-DD HH:mm:ss");
  locktimes = m3 * 60 * 60;
  //console.log("sssssss", locktimes);

  const abiArray = JSON.parse(abi2);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS,
    {
      from: myAddress,
    }
  );

  
  var gasPriceGwei = 53;
  var gasLimit = 800000;

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.REFERRAL_CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.checkin(locktimes).encodeABI(),
  };
  //console.log(
  //  `Raw of Transaction: \n${JSON.stringify(
  //    rawTransaction,
  //    null,
  //    "\t"
  //  )}\n------------------------`
  // );

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
        //console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
        bonusLogger.log({
          level: "info",
          message: {
            task: "DailycheckinBonas",
            request: req.body,
            response: receipt.transactionHash,
          },
        });

        res.status(201).send({ status: true, msg: receipt.transactionHash });
      });
      sentTx.on("error", (err) => {
        //console.log(err);
        res.status(404).send({ status: false, msg: "Failed" });
      });
    })
    .catch((err) => {
      //console.log(err);
    });
};

const getUser = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  //console.log(`web3 version: ${web3.version}`);
  const abiArray = JSON.parse(abi2);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS
  );

  var getUsers = await contract.methods.isuser(myAddress).call();
  //console.log(getUsers);

  loginLogger.log({
    level: "info",
    message: {
      task: "getUser",
      request: req.body,
      response: getUsers,
    },
  });

  res.status(201).send({ status: true, data: getUsers });
};

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
          postLogger.log({
            level: "info",
            message: {
              task: "createPost",
              request: {
                myAddress,
                privateKey,
                _hashtag,
                _content,
                _imghash,
                videoHash,
              },
              response: receipt.transactionHash,
            },
          });

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

const getPost = async (req, res) => {
  var myAddress = req.body.myAddress;
  var pages = req.body.pages;
  var limits = req.body.limits;
  const abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let addlpid = await contract.methods.getUserPosts(myAddress).call();
  let totalid = addlpid.length;
  //const last200Indexes = addlpid.slice(-200);
  if (totalid == 0) {
    res.status(201).send({ status: true, data: { results: [] } });
  } else {
    const propertyValues = Object.values(addlpid);
    let count = 0;
    let aaaa = [];
    propertyValues.forEach(async (element, i, totalid) => {
      await sleep(i * 10);
      var contract1 = new web3.eth.Contract(abiArray,process.env.CONTRACT_ADDRESS );
      var contract2 = new web3.eth.Contract( abiArray, process.env.CONTRACT_ADDRESS );
      await contract1.methods.pstIds(element).call().then(async (re) => {
          await contract2.methods.profiles(re.author).call().then(async (reee) => {
              let profiless = reee.Profileimgg;
              var string = profiless.split("*");
              let noEmptyStringsss = string.filter((str) => str !== "*");
              const noEmptyStringssss = noEmptyStringsss.filter((str) => str !== "" );
              if (noEmptyStringssss != "") {
                var date1 = new Date(re.timestamp * 1000);
                var time = new Date(date1).toLocaleString(undefined, {
                  timeZone: "Asia/Kolkata",
                });
                var string = re.imgHash.split("*");
                const noEmptyStrings = string.filter((str) => str !== "");
                let noEmptyStringss = noEmptyStrings.filter( (str) => str !== "*");
                re.imgHash = noEmptyStringss;
                re.ProfileTag = noEmptyStringssss[0];
                re.timestamp = time;

                let videoHashstring = re.videoHash;
                var videoHashstrings = videoHashstring.split("*");
                let videoHashstringssss = videoHashstrings.filter((str) => str !== "*" );
                const videoHashstringssssss = videoHashstringssss.filter((str) => str !== "" );
                re.videoHash = videoHashstringssssss;

                if (re.author == "0x0000000000000000000000000000000000000000") {
                  count = count + 1;
                } else {
                  aaaa.push(re);
                  count = count + 1;
                }
              } else {
                var date1 = new Date(re.timestamp * 1000);
                var time = new Date(date1).toLocaleString(undefined, {
                  timeZone: "Asia/Kolkata",
                });
                var string = re.imgHash.split("*");
                const noEmptyStrings = string.filter((str) => str !== "");
                let noEmptyStringss = noEmptyStrings.filter(
                  (str) => str !== "*"
                );
                re.imgHash = noEmptyStringss;
                re.ProfileTag = "";
                re.timestamp = time;

                let videoHashstring = re.videoHash;
                var videoHashstrings = videoHashstring.split("*");
                let videoHashstringssss = videoHashstrings.filter( (str) => str !== "*" );
                const videoHashstringssssss = videoHashstringssss.filter( (str) => str !== "" );
                re.videoHash = videoHashstringssssss;
                if (re.author == "0x0000000000000000000000000000000000000000") {
                  count = count + 1;
                } else {
                  aaaa.push(re);
                  count = count + 1;
                }
              }
            });
        });
      if (count === totalid.length) {
        await paginatedResults(aaaa.reverse(), pages, limits).then(
          async (r) => {
            res.status(201).send({ status: true, data: r });
          }
        );
      }
    });
  }
};

const getpostbyid = async (req, res, next) => {
  var postId = req.body.postId;
  let aaaa = [];
  //console.log(`web3 version: ${web3.version}`);

  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let username = await contract.methods.pstIds(postId).call();
  aaaa.push(username);
  //console.log(aaaa);

  res.status(201).send({ status: true, data: aaaa });
};
const getallPostss = async (req, res) => {
  var pages = req.body.pages;
  var limits = req.body.limits;
  let alll = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";

  const abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let addlpid = await contract.methods.getallPosts(alll).call();

  console.log("re",addlpid)

  let aaaa = [];
  let count =0
  propertyValues = addlpid;
  propertyValues.forEach(async (element, i) => {
    await sleep(i * 10);
    var contract1 = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
    await contract1.methods.AllPostIds(element).call().then(async (re) => {
     // console.log("re",re)


      //   let profiless = re.Profileimgg;
      //   var strings = (profiless).split("*");
      //   let noEmptyStringsss = strings.filter((str) => str !== '*');
      //   const noEmptyStringssss = noEmptyStringsss.filter((str) => str !== "");

      var strings = re.ProfileTag.split("*");
      const noEmptyStringssss = strings.filter((str) => str !== "");
      let noEmptyStringsssss = noEmptyStringssss.filter((str) => str !== "*");
      if(noEmptyStringsssss != "") {
          re.ProfileTag = noEmptyStringsssss[0];

          var date1 = new Date(re.timestamp * 1000);
          var time = new Date(date1).toLocaleString(undefined, {
            timeZone: "Asia/Kolkata",});
          re.timestamp = time;
          var string = re.imgHash.split("*");
          const noEmptyStrings = string.filter((str) => str !== "");
          let noEmptyStringss = noEmptyStrings.filter((str) => str !== "*"); 
          re.imgHash = noEmptyStringss;
          aaaa.push(re);
         // console.log(aaaa)

          count++;
      }else{
          var date1 = new Date(re.timestamp * 1000);
          var time = new Date(date1).toLocaleString(undefined, {
            timeZone: "Asia/Kolkata",});
          re.timestamp = time;
          var string = re.imgHash.split("*");
          const noEmptyStrings = string.filter((str) => str !== "");
          let noEmptyStringss = noEmptyStrings.filter((str) => str !== "*");
          re.imgHash = noEmptyStringss;
        aaaa.push(re);
        count++;
       // console.log(aaaa)

      }
      });
      if (count == addlpid.length) {
          await paginatedResults(aaaa.reverse(), pages, limits).then(async (r) => {
          res.status(201).send({ status: true, data: r });
          });
    }
  });
};
const getallPost = async (req, res) => {
  var pages = req.body.pages;
  var limits = req.body.limits;
  const abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let addlpid = await contract.methods.alltotalposts().call();
  console.log(addlpid);
  let id = [];
  let idcount = 0;
  let loopcount = parseFloat(addlpid) - 200;
  for (let step = parseFloat(addlpid); step > loopcount; step--) {
    id.push(step);
    idcount = idcount + 1;
  }
  var arrayid = Object.values(id);
  const shuffledIndex = shuffleArrayIndex(arrayid);
  let shuffledIndexs = shuffledIndex.map((i) => arrayid[i]);
  let aaaa = [];
  let count = 0;

  propertyValues = shuffledIndexs.reverse();
  propertyValues.forEach(async (element, i) => {
    await sleep(i * 10);
    var contract1 = new web3.eth.Contract(
      abiArray,
      process.env.CONTRACT_ADDRESS
    );
    await contract1.methods
      .AllPostIds(element)
      .call()
      .then(async (re) => {
        if (re.author != "0x0000000000000000000000000000000000000000") {
          await contract1.methods
            .profiles(re.author)
            .call()
            .then(async (reee) => {
              let profiless = reee.Profileimgg;
              var string = profiless.split("*");
              let noEmptyStringsss = string.filter((str) => str !== "*");
              const noEmptyStringsssss = noEmptyStringsss.filter(
                (str) => str !== ""
              );
               // console.log(reee)
              if (noEmptyStringsssss != "") {
                re.ProfileTag = noEmptyStringsssss[0];

                var date1 = new Date(re.timestamp * 1000);
                var time = new Date(date1).toLocaleString(undefined, {
                  timeZone: "Asia/Kolkata",
                });
                re.timestamp = time;
                var string = re.imgHash.split("*");
                const noEmptyStrings = string.filter((str) => str !== "");
                let noEmptyStringss = noEmptyStrings.filter(
                  (str) => str !== "*"
                );
                re.imgHash = noEmptyStringss;


                let videoHashstring = re.videoHash;
                var videoHashstrings = videoHashstring.split("*");
                let videoHashstringssss = videoHashstrings.filter(
                  (str) => str !== "*"
                );
                const videoHashstringssssss = videoHashstringssss.filter(
                  (str) => str !== ""
                );
                re.videoHash = videoHashstringssssss;


                aaaa.push(re);
                count++;
              } else {
                var date1 = new Date(re.timestamp * 1000);
                var time = new Date(date1).toLocaleString(undefined, {
                  timeZone: "Asia/Kolkata",
                });
                re.timestamp = time;
                var string = re.imgHash.split("*");
                const noEmptyStrings = string.filter((str) => str !== "");
                let noEmptyStringss = noEmptyStrings.filter(
                  (str) => str !== "*"
                );
                re.imgHash = noEmptyStringss;

                let videoHashstring = re.videoHash;
                var videoHashstrings = videoHashstring.split("*");
                let videoHashstringssss = videoHashstrings.filter(
                  (str) => str !== "*"
                );
                const videoHashstringssssss = videoHashstringssss.filter(
                  (str) => str !== ""
                );
                re.videoHash = videoHashstringssssss;
                aaaa.push(re);
                count++;
              }
            });

          if (count == idcount) {
            await paginatedResults(aaaa.reverse(), pages, limits).then(
              async (r) => {
                res.status(201).send({ status: true, data: r });
              }
            );
          }
        } else {
          idcount--;
        }
      });
  });
};

const getallPosts = async (req, res) => {
    let page = parseInt(req.body.pages);
    let limit = parseInt(req.body.limits);
    let skip = 0
    if (page > 1) {
        limit = limit,
            skip = limit * (page - 1)
    }
    let db = await mongoDB.connectDB()
    let postcollection = await db.collection('post');
    let resultData = await postcollection.find({}, { limit: limit, skip: skip }).sort({ _id: -1 }).collation({ locale: "en_US", numericOrdering: true }).toArray();
    res.status(201).send({ status: true, data: { results: resultData } });
};

const editPost = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var _id = req.body._id;
  var _hashtag = req.body._hashtag;
  var _content = req.body._content;
  var _imghash = req.body._imghash;

  //console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  //console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

  
  var gasPriceGwei = 53;
  //console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  //console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods
      .editPost(_id, _hashtag, _content, _imghash)
      .encodeABI(),
  };
  //   console.log(
  //     `Raw of Transaction: \n${JSON.stringify(
  //       rawTransaction,
  //       null,
  //       "\t"
  //     )}\n------------------------`
  //   );

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
        //console.log("https://fufiscan.com/tx/" + receipt.transactionHash);

        postLogger.log({
          level: "info",
          message: {
            task: "editPost",
            request: req.body,
            response: receipt.transactionHash,
          },
        });

        res.status(201).send({ status: true, msg: receipt.transactionHash });
      });
      sentTx.on("error", (err) => {
        //console.log(err);
        res.status(404).send({ status: false, msg: "Failed" });
      });
    })
    .catch((err) => {
      //console.log(err);
    });
};

const deletePost = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var PostId = req.body.PostId;

  //console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  //console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

  
  var gasPriceGwei = 53;
  //console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  //console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.deletePost(PostId).encodeABI(),
  };
  //   console.log(
  //     `Raw of Transaction: \n${JSON.stringify(
  //       rawTransaction,
  //       null,
  //       "\t"
  //     )}\n------------------------`
  //   );

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
        //console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
        postLogger.log({
          level: "info",
          message: {
            task: "deletePost",
            request: req.body,
            response: receipt.transactionHash,
          },
        });

        res.status(201).send({ status: true, msg: receipt.transactionHash });
      });
      sentTx.on("error", (err) => {
        //console.log(err);
        res.status(404).send({ status: false, msg: "Failed" });
      });
    })
    .catch((err) => {
      //console.log(err);
    });
};

const banPost = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var PostId = req.body.PostId;

  //console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  //console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

  
  var gasPriceGwei = 53;
  //console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  //console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.banPost(PostId).encodeABI(),
  };
  //   //console.log(
  //     `Raw of Transaction: \n${JSON.stringify(
  //       rawTransaction,
  //       null,
  //       "\t"
  //     )}\n------------------------`
  //   );

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
        //console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
        postLogger.log({
          level: "info",
          message: {
            task: "banPost",
            request: req.body,
            response: receipt.transactionHash,
          },
        });

        res.status(201).send({ status: true, msg: receipt.transactionHash });
      });
      sentTx.on("error", (err) => {
        //console.log(err);
        res.status(404).send({ status: false, msg: "Failed" });
      });
    })
    .catch((err) => {
      //console.log(err);
    });
};

const likePost = async (req, res, next) => {
  // console.log("##############################", req.body)
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var PostId = req.body.PostId;

  //console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  //console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

  
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.likePost(PostId).encodeABI(),
  };
  // console.log(
  //    `Raw of Transaction: \n${JSON.stringify(rawTransaction, null, "\t")}\n--`
  //  );
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
        console.log("LIKE >>>>>>" + receipt);

        console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
        postLogger.log({
          level: "info",
          message: {
            task: "likePost",
            request: req.body,
            response: receipt.transactionHash,
          },
        });

        let db = await mongoDB.connectDB();
        let postcollection = await db.collection("post");
        let usercollection = await db.collection("users");

        let dbpostdata = await postcollection.findOne({ allpstId: PostId });
        let dbueserdata = await usercollection.findOne({
          useraddress: myAddress,
        });

        let tofullname = dbpostdata ? dbpostdata.Name : "";
        let byname = dbueserdata ? dbueserdata.Name : "";
        let touseraddress = dbpostdata ? dbpostdata.author : "";

        eventreward(
          myAddress,
          150,
          "like",
          tofullname,
          byname,
          touseraddress
        ).then(async (r) => {
          console.log("likeeeeeeeeeee");
        });

        res.status(201).send({ status: true, msg: receipt.transactionHash });
      });
      sentTx.on("error", (err) => {
        console.log("LIKE ERROR >>>>>>>>>>>>", err);
        res.status(404).send({ status: false, msg: "Failed" });
      });
    })
    .catch((err) => {
      console.log("LIKE ERROR >>>>>>>>>>>>", err);
      console.log(err);
    });
};

const dislikePost = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var PostId = req.body.PostId;

  //console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  //console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

  
  var gasPriceGwei = 53;
  //console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  //console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.dislikePost(PostId).encodeABI(),
  };
  //   //console.log(
  //     `Raw of Transaction: \n${JSON.stringify(rawTransaction, null, "\t")}\n--`
  //   );
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
        //console.log("https://fufiscan.com/tx/" + receipt.transactionHash);

        postLogger.log({
          level: "info",
          message: {
            task: "likePost",
            request: req.body,
            response: receipt.transactionHash,
          },
        });

        res.status(201).send({ status: true, msg: receipt.transactionHash });
      });
      sentTx.on("error", (err) => {
        //console.log(err);
        res.status(404).send({ status: false, msg: "Failed" });
      });
    })
    .catch((err) => {
      //console.log(err);
    });
};

const createComment = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var postId = req.body.postId;
  var messages = req.body.messages;

  //console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  //console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

  
  var gasPriceGwei = 53;
  //console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  //console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.createComment(postId, messages).encodeABI(),
  };
  //   //console.log(
  //     `Raw of Transaction: \n${JSON.stringify(
  //       rawTransaction,
  //       null,
  //       "\t"
  //     )}\n------------------------`
  //   );

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
        //console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
        postLogger.log({
          level: "info",
          message: {
            task: "createComment",
            request: req.body,
            response: receipt.transactionHash,
          },
        });

        let db = await mongoDB.connectDB();
        let postcollection = await db.collection("post");
        let usercollection = await db.collection("users");
        let dbpostdata = await postcollection.findOne({ allpstId: postId });
        let dbueserdata = await usercollection.findOne({
          useraddress: myAddress,
        });

        let tofullname = dbpostdata ? dbpostdata.Name : "";
        let byname = dbueserdata ? dbueserdata.Name : "";
        let touseraddress = dbpostdata ? dbpostdata.author : "";

        eventreward(
          myAddress,
          150,
          "Comment",
          tofullname,
          byname,
          touseraddress
        ).then(async (r) => {
          //console.log("Commentttttttttt");
        });

        res.status(201).send({ status: true, msg: receipt.transactionHash });
      });
      sentTx.on("error", (err) => {
        //console.log(err);
        res.status(404).send({ status: false, msg: "Failed" });
      });
    })
    .catch((err) => {
      //console.log(err);
    });
};

const getComments = async (req, res, next) => {
  var postId = req.body.postId;

  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let contract2 = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);

  await contract.methods
    .getComment(postId)
    .call()
    .then(async (r) => {
      let data = [];
      if (r && r.length > 0) {
        r.forEach(async (e, i) => {
          let profiless = e.profile;
          var string = profiless.split("*");
          let noEmptyStrings = string.filter((str) => str !== "*");
          let img = noEmptyStrings[0];
          console.log(img);
          let eb = {};
          eb.msgid = e.msgId;
          eb.postId = e.postId;
          eb.reciver = e.username;
          eb.name = e.name;
          eb.messages = e.messages;
          eb.profile = img;
          eb.timestamp = e.timestamp;
          // eb.totalComments = re;
          data.push(eb);
          // });
        });
        res.status(200).send({ status: true, data: data });
      } else {
        res.status(201).send({ status: true, data: data });
      }
    })
    .catch((er) => {
      //console.log("Hhbdfhj", er);
    });
};

const reportPost = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var PostId = req.body.PostId;

  //console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  //console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

  var gasPriceGwei = 53;
  //console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  //console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.reportPost(PostId).encodeABI(),
  };
  //   //console.log(
  //     `Raw of Transaction: \n${JSON.stringify(
  //       rawTransaction,
  //       null,
  //       "\t"
  //     )}\n------------------------`
  //   );

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
        //console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
        postLogger.log({
          level: "info",
          message: {
            task: "rePost",
            request: req.body,
            response: receipt.transactionHash,
          },
        });

        res.status(201).send({ status: true, msg: receipt.transactionHash });
      });
      sentTx.on("error", (err) => {
        //console.log(err);
        res.status(404).send({ status: false, msg: "Failed" });
      });
    })
    .catch((err) => {
      //console.log(err);
    });
};

const getreferralRehistory = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi2);
  let contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS
  );
  let getreferralRehistory = await contract.methods
    .getreferralRe(myAddress)
    .call();
  //console.log(getreferralRehistory);
  referralLogger.log({
    level: "info",
    message: {
      task: "getreferralRehistory",
      request: req.body,
      response: getreferralRehistory,
    },
  });
  res.status(201).send({ status: true, data: getreferralRehistory });
};

const getreferralreward = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi2);
  let contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS
  );
  let referralreward = await contract.methods.referralreward(myAddress).call();
  var amounts = web3.utils.fromWei(referralreward, "ether");

  //console.log(amounts);
  rewardLogger.log({
    level: "info",
    message: {
      task: "getreferralreward",
      request: req.body,
      response: amounts,
    },
  });
  res.status(201).send({ status: true, data: amounts });
};

const getparentrewardss = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let referralreward = await contract.methods
    .getparentrewardss(myAddress)
    .call();
  //console.log(referralreward);
  rewardLogger.log({
    level: "info",
    message: {
      task: "getparentrewardss",
      request: req.body,
      response: referralreward,
    },
  });
  res.status(201).send({ status: true, data: referralreward });
};

const getBonasRe = async (req, res, next) => {
  var pages = req.body.pages;
  var limits = req.body.limits;
  var myAddress = req.body.myAddress;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi2);
  let contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS
  );
  let getBonasRes = await contract.methods.getBonasRe(myAddress).call();
  //console.log(getBonasRes);
  rewardLogger.log({
    level: "info",
    message: {
      task: "getBonasRe",
      request: req.body,
      response: getBonasRes,
    },
  });

  await paginatedResults(aaaa, pages, limits).then(async (r) => {
    res.status(201).send({ status: true, data: r.results });
  });
};

const getListReferrals = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi2);

  let contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS
  );
  let getListReferralss = await contract.methods
    .getListReferrals(myAddress)
    .call();
  //console.log(getListReferralss);
  if (getListReferralss == 0) {
    res.status(201).send({ status: true, data: [] });
  } else {
    let chaild = getListReferralss.length;

    const propertyValues = Object.values(getListReferralss);
    let count = 0;
    let aaaa = [];
    propertyValues.forEach(async (element) => {
      if (element == 0x0000000000000000000000000000000000000000) {
        count = count + 1;
      } else {
        aaaa.push(element);
        count = count + 1;
      }
      //console.log("chaild", chaild);
      ////console.log("aaaaaaa", count);
      if (count === chaild) {
        //console.log("aaaaccccc", aaaa);
        referralLogger.log({
          level: "info",
          message: {
            task: "getListReferrals",
            request: req.body,
            response: aaaa,
          },
        });

        res.status(201).send({ status: true, data: aaaa });
      }
    });
  }
};

const getdirectReferralscount = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi2);
  let contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS
  );
  let memberss = await contract.methods.getListReferrals(myAddress).call();
  //console.log(memberss);
  // referralLogger.log({
  //   level: "info",
  //   message: {
  //     task: "getdirectReferralscount",
  //     request: req.body,
  //     response: memberss,
  //   },
  // });
  res.status(201).send({ status: true, data: memberss.length });
};

const getTotalReferralscount = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi2);
  let contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS
  );
  let getTotalReferralscount = await contract.methods
    .getTotalReferralscount(myAddress)
    .call();
  //console.log(getTotalReferralscount);
  referralLogger.log({
    level: "info",
    message: {
      task: "getTotalReferralscount",
      request: req.body,
      response: getTotalReferralscount,
    },
  });
  res.status(201).send({ status: true, data: getTotalReferralscount });
};

const getpostreward = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  await contract.methods
    .getpostreward(myAddress)
    .call()
    .then((r) => {
      let data = [];
      if (r && r.length > 0) {
        r.forEach((e, i) => {
          //console.log("HHHHHHHH", e);
          let eb = {};
          eb.username = e.username;
          eb.chaild = e.chaild;
          eb.amt = e.ant;
          eb.timestamp = e.timestamp;
          data.push(eb);
        });
        rewardLogger.log({
          level: "info",
          message: {
            task: "getpostreward",
            request: req.body,
            response: data,
          },
        });
        paginatedResults(data, pages, limits).then(async (r) => {
          res.status(201).send({ status: true, data: r.results });
        });
      } else {
        res.status(201).send({ status: true, data: r.results });
      }
    })
    .catch((er) => {
      //console.log("ghdshdfhdf", er);
    });
};

const getlikerewards = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var pages = req.body.pages;
  var limits = req.body.limits;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  await contract.methods
    .getlikerewards(myAddress)
    .call()
    .then((r) => {
      let data = [];
      if (r && r.length > 0) {
        r.forEach((e, i) => {
          //console.log("HHHHHHHH", e);
          let eb = {};
          eb.username = e.username;
          eb.chaild = e.chaild;
          eb.amt = e.ant;
          eb.timestamp = e.timestamp;
          data.push(eb);
        });
        rewardLogger.log({
          level: "info",
          message: {
            task: "getlikerewards",
            request: req.body,
            response: data,
          },
        });

        paginatedResults(data, pages, limits).then(async (r) => {
          res.status(201).send({ status: true, data: r.results });
        });
      } else {
        paginatedResults(data, pages, limits).then(async (r) => {
          res.status(201).send({ status: true, data: r.results });
        });
      }
    })
    .catch((er) => {
      //console.log("ghdshdfhdf", er);
    });
};

const getCommentreward = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var pages = req.body.pages;
  var limits = req.body.limits;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  await contract.methods
    .getCommentreward(myAddress)
    .call()
    .then((r) => {
      let data = [];
      if (r && r.length > 0) {
        r.forEach((e, i) => {
          //console.log("HHHHHHHH", e);
          let eb = {};
          eb.username = e.username;
          eb.chaild = e.chaild;
          eb.amt = e.ant;
          eb.timestamp = e.timestamp;
          data.push(eb);
        });
        rewardLogger.log({
          level: "info",
          message: {
            task: "getCommentreward",
            request: req.body,
            response: data,
          },
        });
        paginatedResults(data, pages, limits).then(async (r) => {
          res.status(201).send({ status: true, data: r.results });
        });
      } else {
        paginatedResults(data, pages, limits).then(async (r) => {
          res.status(201).send({ status: true, data: r.results });
        });
      }
    })
    .catch((er) => {
      //console.log("ghdshdfhdf", er);
    });
};

const getallUserr = async (req, res, next) => {
  //console.log(`web3 version: ${web3.version}`);
  let abiArray2 = JSON.parse(abi2);
  let abiArray = JSON.parse(abi);

  let contract = new web3.eth.Contract(
    abiArray2,
    process.env.REFERRAL_CONTRACT_ADDRESS
  );
  let getallUserr = await contract.methods.getUserr().call();
  //console.log(getallUserr);
  if (getallUserr == 0) {
    res.status(201).send({ status: true, data: [] });
  } else {
    let Userrid = getallUserr.length;
    //console.log("Userrid", Userrid);
    const propertyValues = Object.values(getallUserr);
    let count = 0;
    let aaaa = [];
    propertyValues.forEach(async (element, i, Userrid) => {
      await sleep(10 * i);
      var contract1 = new web3.eth.Contract(
        abiArray,
        process.env.CONTRACT_ADDRESS
      );
      await contract1.methods
        .usernames(element)
        .call()
        .then(async (ree) => {
          await contract1.methods
            .profiles(element)
            .call()
            .then(async (re) => {
              var date1 = new Date(re.time * 1000);
              var time = new Date(date1).toLocaleString(undefined, {
                timeZone: "Asia/Kolkata",
              });

              re.time = time;
              re.UserName = ree;
              aaaa.push(re);
              count = count + 1;
            });
          if (count === Userrid.length) {
            res.status(201).send({ status: true, data: aaaa.reverse() });
          }
        });
    });
  }
};

const getUser1 = async (req, res, next) => {
  var index = req.body.index;

  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi2);
  let contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS
  );
  let getUserrr = await contract.methods.getuser(index).call();
  //console.log(getUserrr);
  res.status(201).send({ status: true, data: getUserrr });
};

const usernameAvailable = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  //console.log(`web3 version: ${web3.version}`);

  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let username = await contract.methods.usernameAvailable(myAddress).call();
  //console.log(username);
  postLogger.log({
    level: "info",
    message: {
      task: "usernameAvailable",
      request: req.body,
      response: username,
    },
  });
  res.status(201).send({ status: true, data: username });
};

const nextbonustime = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  //console.log(`web3 version: ${web3.version}`);

  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let username = await contract.methods.lockTime(myAddress).call();
  //console.log(username);
  bonusLogger.log({
    level: "info",
    message: {
      task: "nextbonustime",
      request: req.body,
      response: username,
    },
  });
  res.status(201).send({ status: true, data: username });
};

const onetimereward = async (req, res, next) => {
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let getUserrr = await contract.methods.getallreward().call();
  //console.log(getUserrr);
  res.status(201).send({ status: true, data: getUserrr });
};

const totalcheckinBonas = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let getUserrr = await contract.methods.DalycheckinBonas(myAddress).call();
  //console.log(getUserrr);
  bonusLogger.log({
    level: "info",
    message: {
      task: "totalcheckinBonas",
      request: req.body,
      response: getUserrr,
    },
  });
  res.status(201).send({ status: true, data: getUserrr });
};

const sumpostreward = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let getUserrr = await contract.methods.sumpostreward(myAddress).call();
  //console.log(getUserrr);
  rewardLogger.log({
    level: "info",
    message: {
      task: "sumpostreward",
      request: req.body,
      response: getUserrr,
    },
  });
  res.status(201).send({ status: true, data: getUserrr });
};

const sumCommentreward = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let getUserrr = await contract.methods.sumCommentreward(myAddress).call();
  //console.log(getUserrr);
  rewardLogger.log({
    level: "info",
    message: {
      task: "sumCommentreward",
      request: req.body,
      response: getUserrr,
    },
  });
  res.status(201).send({ status: true, data: getUserrr });
};

const sumlikereward = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let getUserrr = await contract.methods.sumlikereward(myAddress).call();
  //console.log(getUserrr);
  rewardLogger.log({
    level: "info",
    message: {
      task: "sumlikereward",
      request: req.body,
      response: getUserrr,
    },
  });
  res.status(201).send({ status: true, data: getUserrr });
};

const sumparentreward = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let getUserrr = await contract.methods.sumparentreward(myAddress).call();
  //console.log(getUserrr);
  rewardLogger.log({
    level: "info",
    message: {
      task: "sumparentreward",
      request: req.body,
      response: getUserrr,
    },
  });
  res.status(201).send({ status: true, data: getUserrr });
};

const getallUser = async (req, res, next) => {
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi2);
  let contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS
  );
  let getUserrr = await contract.methods.getUserr().call();
  //console.log(getUserrr.length);
  res.status(201).send({ status: true, data: getUserrr });
};

const updatereferral = async (req, res, next) => {
  var myAddress = process.env.OwnerAddress;
  var privateKey = process.env.privateKey;
  var amt = req.body.amt;

  //console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  //console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

  var gasPriceGwei = 53;
  //console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  //console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.updatereferral(amt).encodeABI(),
  };
  //   //console.log(
  //     `Raw of Transaction: \n${JSON.stringify(
  //       rawTransaction,
  //       null,
  //       "\t"
  //     )}\n------------------------`
  //   );

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
        //console.log("https://fufiscan.com/tx/" + receipt.transactionHash);

        referralLogger.log({
          level: "info",
          message: {
            task: "updatereferral",
            request: req.body,
            response: receipt.transactionHash,
          },
        });

        res.status(201).send({ status: true, msg: receipt.transactionHash });
      });
      sentTx.on("error", (err) => {
        //console.log(err);
        res.status(404).send({ status: false, msg: "Failed" });
      });
    })
    .catch((err) => {
      //console.log(err);
    });
};

const getallmembersRe = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var pages = req.body.pages;
  var limits = req.body.limits;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi2);
  let contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS
  );
  let getUserrr = await contract.methods.getallmembersRe(myAddress).call();
  //console.log(getUserrr);
  rewardLogger.log({
    level: "info",
    message: {
      task: "getallmembersRe",
      request: req.body,
      response: getUserrr,
    },
  });

  await paginatedResults(getUserrr, pages, limits).then(async (r) => {
    res.status(201).send({ status: true, data: r.results });
  });
};

const gethashtag = async (req, res) => {
  var hashtag = req.body.hashtag;
  var myAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
  const abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let addlpid = await contract.methods.getallPosts(myAddress).call();
  let totalid = addlpid.length;
  //console.log("totalid", totalid);
  const propertyValues = Object.values(addlpid);
  let count = 0;
  let hhhh = [];

  propertyValues.forEach(async (element, i, totalid) => {
    var contract1 = new web3.eth.Contract(
      abiArray,
      process.env.CONTRACT_ADDRESS
    );
    await contract1.methods
      .AllPostIds(element)
      .call()
      .then(async (re) => {
        str = re.hashtag.replace(/"/g, "");
        if (str != hashtag) {
          count = count + 1;
        } else {
          hhhh.push(re);
          count = count + 1;
        }
      });
    if (count === totalid.length) {
      //console.log("hhhhhhhhhh");
      res.status(201).send({ status: true, data: hhhh });
    }
  });
};

const getLike = async (req, res, next) => {
  var postId = req.body.postId;
  var pages = req.body.pages;
  var limits = req.body.limits;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  await contract.methods
    .getLike(postId)
    .call()
    .then(async (r) => {
      //console.log("fffffffff", r);

      let data = [];
      if (r && r.length > 0) {
        r.forEach(async (e, i) => {
          // console.log("HHHHHHHH", e);
          var date1 = new Date(e.timestamp * 1000);
          var time = new Date(date1).toLocaleString(undefined, {
            timeZone: "Asia/Kolkata",
          });

          let profiless = e.Profileimgg;
          var string = profiless.split("*");
          let noEmptyStrings = string.filter((str) => str !== "*");
          let img = noEmptyStrings[0];
          console.log(img);
          let eb = {};

          eb.likeId = e.likeId;
          eb.postId = e.postId;
          eb.name = e.name;
          eb.username = e.username;
          eb.useraddress = e.useraddress;
          eb.Profileimgg = img;
          eb.timestamp = time;
          data.push(eb);
        });
        await paginatedResults(data.reverse(), pages, limits).then(
          async (r) => {
            res.status(201).send({ status: true, data: r });
          }
        );
        ////console.log("aaaaaaaaa",data)

        rewardLogger.log({
          level: "info",
          message: {
            task: "getCommentreward",
            request: req.body,
            response: data,
          },
        });
      }
    })

    .catch((er) => {
      //console.log("ghdshdfhdf", er);
    });
};

const Search = async (req, res) => {
  var input_data = req.body.UserNames;
  let db = await mongoDB.connectDB();
  let userscollection = await db.collection("users");

  let result = await userscollection
    .find({
      $or: [
        { UserName: { $regex: input_data, $options: "i" } },
        { Name: { $regex: input_data, $options: "i" } },
        { useraddress: { $regex: input_data, $options: "i" } },
      ],
    })
    .toArray();
  if (result) {
    res.status(201).send({ status: true, data: result });
  } else {
    res.status(401).send({ status: false, data: result });
  }
};

const CommentonComment = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var CommentId = req.body.CommentId;
  var messages = req.body.messages;

  //console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  //console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

  var gasPriceGwei = 53;
  //console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  //console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.CommentComment(CommentId, messages).encodeABI(),
  };
  //   //console.log(
  //     `Raw of Transaction: \n${JSON.stringify(
  //       rawTransaction,
  //       null,
  //       "\t"
  //     )}\n------------------------`
  //   );

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
        //console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
        postLogger.log({
          level: "info",
          message: {
            task: "createComment",
            request: req.body,
            response: receipt.transactionHash,
          },
        });

        let db = await mongoDB.connectDB();
        let postcollection = await db.collection("post");
        let usercollection = await db.collection("users");
        let dbpostdata = await postcollection.findOne({ allpstId: CommentId });
        let dbueserdata = await usercollection.findOne({
          useraddress: myAddress,
        });

        let tofullname = dbpostdata ? dbpostdata.Name : "";
        let byname = dbueserdata ? dbueserdata.Name : "";
        let touseraddress = dbpostdata ? dbpostdata.author : "";

        eventreward(
          myAddress,
          150,
          "Comment",
          tofullname,
          byname,
          touseraddress
        ).then(async (r) => {
          //console.log("Commentttttttttt");
        });

        res.status(201).send({ status: true, msg: receipt.transactionHash });
      });
      sentTx.on("error", (err) => {
        //console.log(err);
        res.status(404).send({ status: false, msg: "Failed" });
      });
    })
    .catch((err) => {
      //console.log(err);
    });
};

const getCommentonomment = async (req, res, next) => {
  var CommentId = req.body.CommentId;
  var limits = req.body.limits;
  var pages = req.body.pages;
  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  await contract.methods
    .readCommentComment(CommentId)
    .call()
    .then(async (r) => {
      if (r == 0) {
        res.status(201).send({ status: true, data: [] });
      } else {
        //console.log("jdjhfd", r);
        let data = [];
        if (r && r.length > 0) {
          r.forEach(async (e, i) => {
            let eb = {};
            eb.msgid = e.msgId;
            eb.CommentId = e.CommentId;
            eb.username = e.username;
            eb.name = e.name;

            eb.profile = e.profile;
            eb.messages = e.messages;
            eb.timestamp = e.timestamp;
            data.push(eb);
          });
          //  await paginatedResults(data.reverse(), pages, limits).then(async (r) => {
          res.status(201).send({ status: true, data: data });
        }
      }
    })
    .catch((er) => {
      //console.log("Hhbdfhj", er);
    });
};

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

async function Referral(myAddress, referralcode) {
  return new Promise(async function executor(resolve, reject) {
    var data = JSON.stringify({
      child: myAddress,
      parent: referralcode,
    });

    var config = {
      method: "post",
      url: "https://reward.cryptoxin.com/addreferal",
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

const getliker = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var postId = req.body.postId;

  //console.log(`web3 version: ${web3.version}`);
  let abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let getUserrr = await contract.methods.postLikers(myAddress, postId).call();
  //console.log(getUserrr);
  res.status(201).send({ status: true, data: getUserrr });
};

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
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
  });
}

function shuffleArrayIndex(array) {
  const indexArray = Array.from(array.keys());
  for (let i = indexArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexArray[i], indexArray[j]] = [indexArray[j], indexArray[i]];
  }
  return indexArray;
}

const getusername = async (req, res, next) => {
  let myAddress = req.body.myAddress;

  const abiArrays = JSON.parse(abi);

  var contract = new web3.eth.Contract(abiArrays, process.env.CONTRACT_ADDRESS);

  let username = await contract.methods.usernames(myAddress).call();
  res.status(201).send({ status: true, data: username });
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
  ragistration,
  getUser,
  DailycheckinBonas,
  createPost,
  getPost,
  getpostbyid,
  getallPost,
  editPost,
  deletePost,
  banPost,
  likePost,
  dislikePost,
  createComment,
  getComments,
  reportPost,
  getreferralRehistory,
  getreferralreward,
  getparentrewardss,
  getBonasRe,
  getListReferrals,
  getdirectReferralscount,
  getTotalReferralscount,
  getpostreward,
  getlikerewards,
  getCommentreward,
  getallUserr,
  getUser1,
  usernameAvailable,
  nextbonustime,
  onetimereward,
  totalcheckinBonas,
  sumpostreward,
  sumCommentreward,
  sumlikereward,
  sumparentreward,
  getallUser,
  updatereferral,
  getallmembersRe,
  gethashtag,
  getLike,
  Search,
  CommentonComment,
  getCommentonomment,
  getusername,
};
