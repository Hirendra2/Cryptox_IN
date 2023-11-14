var ethers = require("ethers");
var url = "https://cinscan.cryptoxin.com";

//var url ="http://159.89.169.197:8545"
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/cryabi.json", "utf-8");
const abi2 = fs.readFileSync("./abis/referral.json", "utf-8");
var moment = require("moment");
const mongoDB = require('./mongodb')


async function sleep(millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
}

async function getAllUsers()
{
    let db = await mongoDB.connectDB()
    let userscollection = await db.collection('users');
    let abiArray = JSON.parse(abi2);
    let abiArray2 = JSON.parse(abi);
    let contract = new web3.eth.Contract(
        abiArray,
        process.env.REFERRAL_CONTRACT_ADDRESS
    );
    let getUserrr = await contract.methods.getUserr().call();
   // console.log(getUserrr)
    let totalUserrr = getUserrr.length;
    
    const propertyValues = Object.values(getUserrr);
    let count = 0;
    let User = [];
    
    propertyValues.every(async (element, i) => {
        await sleep(2000 * i);
        var contract1 = new web3.eth.Contract(
            abiArray2,
            process.env.CONTRACT_ADDRESS
        );
        await contract1.methods
            .profiles(element)
            .call()
            .then(async (re) => {
                str = re.UserName.replace(/"/g, "");
               // console.log("UserName >>>>>>>>>>>", str, "#######", re.UserName,count++)

                User.push(re);
                try{
                    await userscollection.insertOne(re)
                }
                catch (err){
                    if (err.code === 11000) {
                        
                    
                    }
                    else {
                        throw new Error(err)
                    }
                    
                 }
                
                
            });
        if (count === totalUserrr) {
            
        }
    });

}

//getAllUsers();

setInterval(() => {    
    getAllUsers();
}, 100000 * 5);
