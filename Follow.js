var ethers = require("ethers");
var url = "https://cinscan.cryptoxin.com";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const { isValid } = require("shortid");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/cryabi.json", "utf-8");
const abi2 = fs.readFileSync("./abis/referral.json", "utf-8");
const abi3 = fs.readFileSync("./abis/follow.json", "utf-8");
const mongoDB = require("./mongodb");

const express = require("express");
const { count } = require("console");
const app = express();

// const Follow = async (req, res, next) => {
//   var myAddress = req.body.myAddress;
//   var privateKey = req.body.privateKey;
//   var friendaddress = req.body.friendaddress;

//   console.log(`web3 version: ${web3.version}`);
//   var count = web3.eth.getTransactionCount(myAddress);
//   console.log(`num transactions so far: ${count}`);

//   const abiArray = JSON.parse(abi3);
//   var contract = new web3.eth.Contract(
//     abiArray,
//     process.env.FOLLOW_CONTRACT_ADDRESS,
//     {
//       from: myAddress,
//     }
//   );

//   
//   var gasPriceGwei = 53;
//   console.log("gasPriceGwei", gasPriceGwei);
//   var gasLimit = 800000;
//   console.log("gasLimit", gasLimit);

//   var rawTransaction = {
//     from: myAddress,
//     gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
//     gasLimit: web3.utils.toHex(gasLimit),
//     to: process.env.FOLLOW_CONTRACT_ADDRESS,
//     value: "0x0",
//     data: contract.methods.Follow(friendaddress).encodeABI(),
//   };

//   const signPromise = web3.eth.accounts.signTransaction(
//     rawTransaction,
//     privateKey
//   );

//   signPromise
//     .then((signedTx) => {
//       const sentTx = web3.eth.sendSignedTransaction(
//         signedTx.raw || signedTx.rawTransaction
//       );
//       sentTx.on("receipt", (receipt) => {
//         console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
//         eventreward(myAddress, 150, "follow").then(async (r) => {
//           console.log("posttttttttt");
//         });
//         res.status(201).send({ status: true, msg: receipt.transactionHash });
//       });
//       sentTx.on("error", (err) => {
//         console.log(err);
//         res.status(404).send({ status: false, msg: "Failed" });
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

const UnFollow = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var friendaddress = req.body.friendaddress;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi3);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.FOLLOW_CONTRACT_ADDRESS,
    {
      from: myAddress,
    }
  );

  
  var gasPriceGwei = 100;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 6599999;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.FOLLOW_CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.UnFollow(friendaddress).encodeABI(),
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

const getFollowers = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  var pages = req.body.pages;
  var limits = req.body.limits;
  console.log(`web3 version: ${web3.versiongetFollowers}`);
  let abiArray = JSON.parse(abi3);
  let abiArray1 = JSON.parse(abi);

  let contract = new web3.eth.Contract(
    abiArray,
    process.env.FOLLOW_CONTRACT_ADDRESS
  );
  let getFollowers = await contract.methods.getallFollow(myAddress).call();
  if (getFollowers == 0) {
    res.status(201).send({ status: true, data: { results: [] } });
  } else {
    let Followersid = getFollowers.length;
    const propertyValues = Object.values(getFollowers);
    let count = 0;
    let aaaa = [];
    propertyValues.forEach(async (element, i, Followersid) => {
      var contract1 = new web3.eth.Contract(abiArray1,process.env.CONTRACT_ADDRESS);
      await contract1.methods.profiles(element).call().then(async (re) => {
       
        if(re.useraddress==myAddress){
          count = count + 1;
        } else{
          var date1 = new Date(re.time * 1000);
          var time = new Date(date1).toLocaleString(undefined, {
            timeZone: "Asia/Kolkata",});

          let profiless = re.Profileimgg;
          var string = profiless.split("*");
          let noEmptyStrings = string.filter((str) => str !== "*");
          let img = noEmptyStrings[0];
          re.Profileimgg = img;
          let backgroundimgg = re.backgroundimgg;
          var string = backgroundimgg.split("*");
          let backgroundimggs = string.filter((str) => str !== "*");
          let background = backgroundimggs[0];
          re.backgroundimgg = background;
          re.time = time;
          aaaa.push(re);
          count = count + 1;
          }
        });
      
      if (count === Followersid.length) {
        await paginatedResults(aaaa, pages, limits).then(async (r) => {
          res.status(201).send({ status: true, data: r });
        });
       
      }
    });
  }
};

const getFollowing = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  var pages = req.body.pages;
  var limits = req.body.limits;
  console.log(`web3 version: ${web3.versiongetFollowing}`);
  let abiArray3 = JSON.parse(abi3);
  let abiArray = JSON.parse(abi);

  let contract = new web3.eth.Contract(
    abiArray3,
    process.env.FOLLOW_CONTRACT_ADDRESS
  );
  let getFollowings = await contract.methods.getallFollowing(myAddress).call();

  var getFollowing = getFollowings.filter(
    (value, index, array) => array.indexOf(value) === index
  );

  let Followingid = getFollowing.length;
  if (getFollowing == 0) {
    res.status(201).send({ status: true, data: [] });
  } else {
    const propertyValues1 = Object.values(getFollowing);
    let count1 = 0;
    let dddd = [];
    propertyValues1.forEach(async (element, i, Followingid) => {
   
        dddd.push(element);
        count1 = count1 + 1;
      

      if (count1 === Followingid.length) {
        const propertyValues = Object.values(dddd);
        let count = 0;
        let aaaa = [];
        propertyValues.forEach(async (element) => {
          var contract1 = new web3.eth.Contract(
            abiArray,
            process.env.CONTRACT_ADDRESS
          );
          await contract1.methods
            .profiles(element)
            .call()
            .then(async (re) => {
              if(re.useraddress==myAddress){
                count = count + 1;
              } else{
              var date1 = new Date(re.time * 1000);
              var time = new Date(date1).toLocaleString(undefined, {
                timeZone: "Asia/Kolkata",
              });

              let profiless = re.Profileimgg;
              var string = profiless.split("*");
              let noEmptyStrings = string.filter((str) => str !== "*");
              // console.log(noEmptyStrings[0]);
              let img = noEmptyStrings[0];
              re.Profileimgg = img;

              let backgroundimgg = re.backgroundimgg;
              var string = backgroundimgg.split("*");
              let backgroundimggs = string.filter((str) => str !== "*");
              // console.log(noEmptyStrings[0]);
              let background = backgroundimggs[0];
              re.backgroundimgg = background;

            
                re.time = time;
                aaaa.push(re);
                count = count + 1;
              
            }
            });

          if (count === dddd.length) {
            await paginatedResults(aaaa, pages, limits).then(async (r) => {
              res.status(201).send({ status: true, data: r });
            });
          }
        });
      }
    });
  }
};

const getNoOffFollowers = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  var pages = req.body.pages;
  var limits = req.body.limits;
  console.log(`web3 version: ${web3.versiongetNoOffFollowers}`);
  let abiArray = JSON.parse(abi3);
  let abiArray1 = JSON.parse(abi);

  let contract = new web3.eth.Contract(
    abiArray,
    process.env.FOLLOW_CONTRACT_ADDRESS
  );
  let getFollowers = await contract.methods.getallFollow(myAddress).call();
  console.log("getNoOffFollowers");

  if (getFollowers == 0) {
    res.status(201).send({ status: true, data: '0' });
  } else {
    let Followersid = getFollowers.length;
    const propertyValues = Object.values(getFollowers);
    let count = 0;
    let aaaa = [];
    propertyValues.forEach(async (element, i, Followersid) => {
      var contract1 = new web3.eth.Contract(
        abiArray1,
        process.env.CONTRACT_ADDRESS
      );
      await contract1.methods
        .profiles(element)
        .call()
        .then(async (re) => {
          if(re.useraddress==myAddress){
            count = count + 1;
          } else{
          var date1 = new Date(re.time * 1000);
          var time = new Date(date1).toLocaleString(undefined, {
            timeZone: "Asia/Kolkata",
          });
          re.time = time;
          aaaa.push(re);
          count = count + 1;
        }
        });
      if (count === Followersid.length) {
        // await paginatedResults(aaaa, pages, limits).then(async (r) => {
        //   res.status(201).send({ status: true, data: r });
        // });
        let aa = count.toString();

        res.status(201).send({ status: true, data: aa });
      }
    });
  }
};

const getNoOffFollowing = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  console.log(`web3 version: ${web3.version}`);
  let abiArray3 = JSON.parse(abi3);
  let abiArray = JSON.parse(abi);

  let contract = new web3.eth.Contract(
    abiArray3,
    process.env.FOLLOW_CONTRACT_ADDRESS
  );
  let getFollowings = await contract.methods.getallFollowing(myAddress).call();

  var getFollowing = getFollowings.filter(
    (value, index, array) => array.indexOf(value) === index
  );

  console.log("getNoOffFollowing");
  if (getFollowing == 0) {
    res.status(201).send({ status: true, data: '0' });
  } else {
    const propertyValues1 = Object.values(getFollowing);
    let count1 = 0;
    let dddd = [];
    propertyValues1.forEach(async (element, i, Followingid) => {
     
        dddd.push(element);
        count1 = count1 + 1;
      

      if (count1 === Followingid.length) {
        const propertyValues = Object.values(dddd);
        let count = 0;
        let aaaa = [];
        propertyValues.forEach(async (element) => {
          var contract1 = new web3.eth.Contract(
            abiArray,
            process.env.CONTRACT_ADDRESS
          );
          await contract1.methods
            .profiles(element)
            .call()
            .then(async (re) => {
              if(re.useraddress==myAddress){
                count = count + 1;
              } else{
              var date1 = new Date(re.time * 1000);
              var time = new Date(date1).toLocaleString(undefined, {
                timeZone: "Asia/Kolkata",
              });

          
                re.time = time;
                aaaa.push(re);
                count = count + 1;
              
            }
              //console.log("aaaaaaa", aaaa);
            });

          if (count === dddd.length) {
            let aa = count.toString();
            //  await paginatedResults(aaaa, pages, limits).then(async (r) => {
            res.status(201).send({ status: true, data: aa });
            // });
          }
        });
      }
    });
  }
};

const testUnFollowlistss = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  console.log(`web3 version: ${web3.version}`);
  let abiArray2 = JSON.parse(abi2);
  let abiArray = JSON.parse(abi);
  let abiArray3 = JSON.parse(abi3);
  console.log("testUnFollowlistss");

  let contract = new web3.eth.Contract(
    abiArray2,
    process.env.REFERRAL_CONTRACT_ADDRESS
  );
  let contract1 = new web3.eth.Contract(
    abiArray3,
    process.env.FOLLOW_CONTRACT_ADDRESS
  );

  await contract.methods
    .getUserr()
    .call()
    .then(async (r) => {
      await contract1.methods
        .getallFollow(myAddress)
        .call()
        .then(async (re) => {
          console.log("uuuuu", r.length);
          console.log("nnnnnn", re.length);
          function removeFromArray(r, re) {
            return r.filter((item) => re.indexOf(item) === -1);
          }
          const arr22 = removeFromArray(r, re);
          let count = 0;
          let bbbb = [];
          let arr2 = arr22.reverse();
          const propertyValues = Object.values(arr2);
          propertyValues.forEach(async (element, i, arr2) => {
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
                  .then(async (reee) => {
                    //console.log("rrrrr",reee)
                    var date1 = new Date(re.time * 1000);
                    var time = new Date(date1).toLocaleString(undefined, {
                      timeZone: "Asia/Kolkata",
                    });
                    re.time = time;
                    re.UserName = ree;
                    bbbb.push(reee);
                    count = count + 1;
                  });
                if (count === arr2.length) {
                  res.status(201).send({ status: true, data: bbbb });
                }
              });
          });
        })
        .catch((e) => {
          console.log("eeeeeeeesid", e);
          res.status(404).send({ status: false, msg: false });
        });
    })
    .catch((e) => {
      console.log("eeeeeeeesid", e);
      return reject(e);
    });
};

const UnFollowlist = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var pages = req.body.pages;
  var limits = req.body.limits;
  console.log("UnFollowlist");

  return new Promise(async (resolve, reject) => {
    console.log(`web3 version: ${web3.version}`);
    let abiArray = JSON.parse(abi);

    let abiArray2 = JSON.parse(abi2);
    let abiArray3 = JSON.parse(abi3);

    let contract = new web3.eth.Contract(
      abiArray2,
      process.env.REFERRAL_CONTRACT_ADDRESS
    );
    let contract1 = new web3.eth.Contract(
      abiArray3,
      process.env.FOLLOW_CONTRACT_ADDRESS
    );

    await contract.methods
      .getUserr()
      .call()
      .then(async (r) => {
        await contract1.methods
          .getallFollow(myAddress)
          .call()
          .then(async (re) => {
            console.log("uuuuu", r.length);
            console.log("nnnnnn", re.length);

            let arr1 = r.filter((val) => !re.includes(val));
            let count = 0;
            let bbbb = [];
            let start = parseFloat(limits) - 25;
            let end = limits;

            let arr2 = arr1.reverse();
            let index = arr2.slice(start, end);
            const propertyValues = Object.values(index);
            propertyValues.forEach(async (element, i, arr2) => {
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
                    .then(async (reee) => {
                      // let profiless = reee.Profileimgg;
                      // var string = profiless.split("*");
                      // let noEmptyStringsss = string.filter((str) => str !== "*");
                      let profiless = reee.Profileimgg;
                      var string = (profiless).split("*");
                      let noEmptyStrings = string.filter((str) => str !== '*');
                      noEmptyStrings = noEmptyStrings[0];

                      // const noEmptyStringssss = noEmptyStringsss.filter(
                      //   (str) => str !== ""
                      // );
                      // console.log("hhhhhhhhhhhhhhh", noEmptyStringssss[0])

                      var date1 = new Date(re.time * 1000);
                      var time = new Date(date1).toLocaleString(undefined, {
                        timeZone: "Asia/Kolkata",


                      });
                      if (noEmptyStrings != "") {
                        reee.Profileimgg = noEmptyStrings;
                        reee.time = time;
                        reee.UserName = ree;
                        bbbb.push(reee);
                        count = count + 1;

                      } else {
                        reee.time = time;
                        reee.UserName = ree;
                        bbbb.push(reee);
                        count = count + 1;

                      //  console.log(reee)

                      }
                    });

                  if (count === arr2.length) {
                    //   console.log("aaaaaaa", arr2.length);
                    //    console.log(bbbb);
                    await paginatedResults(bbbb, pages, limits).then(
                      async (r) => {
                        res.status(201).send({ status: true, data: r });
                      }
                    );
                  }
                });
            });
          })
          .catch((e) => {
            console.log("eeeeeeeesid", e);
            res.status(404).send({ status: false, msg: false });
          });
      })
      .catch((e) => {
        console.log("eeeeeeeesid", e);
        return reject(e);
      });
  });
};

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

const checkusernamess = async (userName) => {
  return new Promise(async (resolve, reject) => {
    const abiArray = JSON.parse(abi);
    let contract = new web3.eth.Contract(
      abiArray,
      process.env.CONTRACT_ADDRESS
    );
    console.log("checkusernamess");
    await contract.methods
      .checkusername()
      .call()
      .then(async (r) => {
        const fo = r.find((element) => element === userName);
        if (fo && fo !== "undefined") {
          let response = { status: false };
          resolve(response);
        } else {
          let response = { status: true };
          resolve(response);
        }
      });
  });
};

const changeUsernames = async (myAddress, privateKey, userName) => {
  return new Promise(async (resolve, reject) => {
    console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);
    console.log("changeUsernames");

    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.CONTRACT_ADDRESS,
      {
        from: myAddress,
      }
    );

    
    var gasPriceGwei = 53;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.changeUsername(userName).encodeABI(),
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
          return resolve(receipt.transactionHash);
        });
        sentTx.on("error", (err) => {
          console.log(err);
          return reject(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const changeUsername = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  let privateKey = req.body.privateKey;
  let userName = req.body.userName;

  await checkusernamess(userName)
    .then(async (r) => {
      console.log("checkusernamess***********");
      if (r.status == false) {
        res.status(201).send({ status: false, data: false });
      } else {
        console.log("tttttt");
        await changeUsernames(myAddress, privateKey, userName)
          .then(async (r) => {
            console.log("changeUsernames***********");
            res.status(201).send({ status: true, data: true });
          })
          .catch((e) => {
            console.log("Referralcfb");
            res.status(404).send({ status: false, data: false });
          });
      }
    })
    .catch((e) => {
      console.log("Referralcfb");
      res.status(404).send({ status: false, data: false });
    });
};

const checkusernamessss = async (req, res, next) => {
  let userName = req.body.userName;
  const abiArray = JSON.parse(abi);
  let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  let addlpid = await contract.methods.checkusername().call();
  console.log("checkusernamessss");
  const fo = addlpid.find((element) => element === userName);
  if (fo && fo !== "undefined") {
    response = { status: false };
    res.status(201).send(response);
  } else {
    response = { status: true };
    res.status(201).send(response);
  }
};

async function eventreward(myAddress, reward, types) {
  return new Promise(async function executor(resolve, reject) {
    var data = JSON.stringify({
      address: myAddress,
      reward: reward,
      type: types,
    });

    var config = {
      method: "post",
      url: "https://reward.cryptoxin.com/eventReward",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then((res) => {})
      .catch(function (error) {
        console.log("errorPostttttttt");
      });
  });
}

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

const getFollowingPost = async (req, res, next) => {
  let address = req.body.myAddress;
  var param = JSON.stringify({
    myAddress: address,
    pages: "1",
    limits: "1000",
  });
  console.log("address",address)

  let followersListData = await axios.post(
    "https://api.cryptoxin.com/getFollowing",
    param,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let followersList = followersListData.data.data.results;

  if (followersList.length > 0) {
    let temp = [];
    followersList.forEach(async (element) => {
      temp.push(element.useraddress);
      if (followersList.length == temp.length) {
        let db = await mongoDB.connectDB();
        let postcollection = await db.collection("post");
        let finalresult = await postcollection
          .find({ author: { $in: temp } }, { _id: 0 })
          .toArray();
        finalresult.length > 0
          ? res
              .status(201)
              .send({ status: true, data: { results: finalresult.reverse() } })
          : res
              .status(401)
              .send({ status: false, data: { results: finalresult.reverse() } });
      }
    });
  }
};

const Follows = async (myAddress, privateKey, friendaddress) => {
  return new Promise(async (resolve, reject) => {
    console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);

    const abiArray = JSON.parse(abi3);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.FOLLOW_CONTRACT_ADDRESS,
      {
        from: myAddress,
      }
    );

    
    var gasPriceGwei = 53;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.FOLLOW_CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.Follow(friendaddress).encodeABI(),
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

          eventreward(myAddress, 150, "follow").then(async (r) => {
            console.log("posttttttttt");
          });
          return resolve( receipt.transactionHash);
          //  res.status(201).send({ status: true, msg: receipt.transactionHash });
        });
        sentTx.on("error", (err) => {
          console.log(err);
          // res.status(404).send({ status: false, msg: "Failed" });
          return reject(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const Follow = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var friendaddress = req.body.friendaddress;

  let abiArray3 = JSON.parse(abi3);
  let contract = new web3.eth.Contract(
    abiArray3,
    process.env.FOLLOW_CONTRACT_ADDRESS
  );
  await contract.methods
    .getallFollowing(myAddress)
    .call()
    .then(async (re) => {
      var getFollowing = re.filter(
        (value, index, array) => array.indexOf(value) === index
      );

      const fo = getFollowing.find((element) => element === friendaddress);
      if (fo && fo !== "undefined") {
        res.status(404).send({ status: false, msg: "Failed" });
      } else {
        await Follows(myAddress, privateKey, friendaddress).then(async (r) => {
          console.log(r)
            res.status(201).send({ status: true, msg: r });
          }).catch(function (error) {});
      }
    });
};


const getFollowings = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  var pages = req.body.pages;
  var limits = req.body.limits;
  console.log(`web3 version: ${web3.versiongetFollowing}`);
  let abiArray3 = JSON.parse(abi3);
  let abiArray = JSON.parse(abi);

  let contract = new web3.eth.Contract(
    abiArray3,
    process.env.FOLLOW_CONTRACT_ADDRESS
  );
  let getFollowings = await contract.methods.getallFollowing(myAddress).call();

  var getFollowing = getFollowings.filter(
    (value, index, array) => array.indexOf(value) === index
  );

  let Followingid = getFollowing.length;
  if (getFollowing == 0) {
    res.status(201).send({ status: true, data: [] });
  } else {
    const propertyValues1 = Object.values(getFollowing);
    let count1 = 0;
    let dddd = [];
    propertyValues1.forEach(async (element, i, Followingid) => {
     
        dddd.push(element);
        count1 = count1 + 1;
      

      if (count1 === Followingid.length) {
        const propertyValues = Object.values(dddd);
        let count = 0;
        let aaaa = [];
        propertyValues.forEach(async (element) => {
          var contract1 = new web3.eth.Contract(
            abiArray,
            process.env.CONTRACT_ADDRESS
          );
          await contract1.methods
            .profiles(element)
            .call()
            .then(async (re) => {
              if(re.useraddress==myAddress){
                count = count + 1;
              } else{
              var date1 = new Date(re.time * 1000);
              var time = new Date(date1).toLocaleString(undefined, {
                timeZone: "Asia/Kolkata",
              });

              let profiless = re.Profileimgg;
              var string = profiless.split("*");
              let noEmptyStrings = string.filter((str) => str !== "*");
              // console.log(noEmptyStrings[0]);
              let img = noEmptyStrings[0];
              re.Profileimgg = img;

              let backgroundimgg = re.backgroundimgg;
              var string = backgroundimgg.split("*");
              let backgroundimggs = string.filter((str) => str !== "*");
              // console.log(noEmptyStrings[0]);
              let background = backgroundimggs[0];
              re.backgroundimgg = background;

            
                re.time = time;
                aaaa.push(re);
                count = count + 1;
              
            }
            });

          if (count === dddd.length) {
            await paginatedResults(aaaa, pages, limits).then(async (r) => {
              res.status(201).send({ status: true, data: r });
            });
          }
        });
      }
    });
  }
};



const checkFolloweruser = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  let friendaddress =  req.body.friendaddress;

  console.log(`web3 version: ${web3.versiongetFollowing}`);
  let abiArray3 = JSON.parse(abi3);

  let contract = new web3.eth.Contract(
    abiArray3,
    process.env.FOLLOW_CONTRACT_ADDRESS
  );
  let getFollowings = await contract.methods.getallFollowing(myAddress).call();
  console.log("getFollowings",getFollowings,friendaddress)



if (getFollowings.indexOf(friendaddress) !== -1) {
  
  console.log('yes');
         res.status(200).send({ status: true, data: "Already Follow" });

} else {
  console.log('no');
         res.status(200).send({ status: false, data: "Not Follow" });

}
  // const propertyValues = Object.values(getFollowings);

  // propertyValues.forEach(async (element) => {

  //   if(element===friendaddress){
  //     res.status(201).send({ status: true, data: "Already Follow" });

  //   }else{

  //     res.status(200).send({ status: false, data: "Not Follow" });
  //   }


  // })



}


module.exports = {
  Follow,
  getFollowers,
  getFollowing,
  getNoOffFollowers,
  getNoOffFollowing,
  UnFollow,
  UnFollowlist,
  checkusernamessss,
  changeUsername,
  testUnFollowlistss,
  paginatedResults,
  getFollowingPost,
getFollowings,
checkFolloweruser
};
