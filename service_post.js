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
const mongoDB = require('./mongodb')
require("dotenv").config();


async function getAllPost() {
    var myAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
    const abiArray = JSON.parse(abi);
    let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
    let totalPostNumber = await contract.methods.alltotalposts().call();
   // console.log("totalPostNumber >> ", totalPostNumber)
    let count = 0;
    let aaaa = [];
    let db = await mongoDB.connectDB()
    let postcollection = await db.collection('post');
    let lastRecord = await postcollection.findOne({}, {sort: {_id: -1}, limit: 1 }); 


     let lastpostnumber = lastRecord ? parseInt(lastRecord.allpstId):"0";
     let totalpostnumber = parseInt(totalPostNumber);

	while (lastpostnumber<totalpostnumber) {
//	console.log("post index >>>>>>>>>>>",lastpostnumber);
        var contract1 = new web3.eth.Contract(
            abiArray,
            process.env.CONTRACT_ADDRESS
        );
        await contract1.methods.AllPostIds(lastpostnumber).call().then(async (re) => {
           await sleep(200)
         //   console.log("ggggggh",re)
            await contract.methods.profiles(re.author).call().then(async (reee) => {
                let profiless = reee.Profileimgg.toString().trim();
                

                var string = profiless.length>0 ? profiless.split("*"):"";
                
                //let noEmptyStringsss = string.filter((str) => str !== '*');
                //let noEmptyStringssss = noEmptyStringsss.filter((str) => str !== "");

                re.ProfileTag =string.length>0 ? string[0]:"";

                var date1 = new Date(re.timestamp * 1000);
                var time = new Date(date1).toLocaleString(undefined, {
                    timeZone: "Asia/Kolkata",
                });
                re.timestamp = time;


                var string = re.imgHash.split("*");
                const noEmptyStrings = string.filter((str) => str !== "");
                let noEmptyStringss = noEmptyStrings.filter((str) => str !== "*");

                re.imgHash = noEmptyStringss;

                
                if (re.author == "0x0000000000000000000000000000000000000000") {
                    count = count + 1;
                } else {
                    aaaa.push(re)
                    
                    try{
                        await postcollection.insertOne(re)
                    }
                    catch (err){
                        
                        if (err.code === 11000) {
                            
                         //console.log("post duplicate  >>  >>>  >>",aaaa.length)
                        
                        }
                        else {
                            
                            throw new Error(err)
                        }
                        
                     }
                    count = count + 1;
                    //console.log("post fetching    >>   >>>   >>",aaaa.length)
                }
            })
        });
        lastpostnumber++;
	}
}

async function sleep(millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
}

//getAllPost();

setInterval(() => {    
getAllPost();  
}, 60000 * 2);

