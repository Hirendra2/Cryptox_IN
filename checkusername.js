

var ethers = require("ethers");
var url = "https://cinscan.cryptoxin.com";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/cryabi.json", "utf-8");




let userName = "HH";


    const checkusername = async (req, res, next) => {

        var userName = req.body.userName;

    const abiArray = JSON.parse(abi);
    let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
    let addlpid = await contract.methods.checkusername().call();
    console.log(addlpid.length)

    for(i=0;i<addlpid.length;i++){
    await contract.methods.allusernames(i).call()
    .then(async (re) => {

        if(re==userName)  {
            console.log("aaaaa",false)
            res.status(201).send({ status: true, data: getUsers.length });

        }
       else{
            console.log("nnnnnn",true)
            res.status(201).send({ status: false, data: getUsers.length });
       }
        
    })
   
}
  
  };
  checkusername(userName)

  async function sleep(millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
  }
  