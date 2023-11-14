var ethers = require("ethers");
var url = "https://cinscan.cryptoxin.com";
var provider = new ethers.providers.JsonRpcProvider(url);
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);

const {
  loginLogger,
  postLogger,
  errorLogger,
  bonusLogger,
  rewardLogger,
  referralLogger,
  followLogger,
} = require("./middlewares/logger");

const createAddress = async (req, res) => {
  const wallet = await ethers.Wallet.createRandom();
  if (!wallet) {
    res.send({ success: false, data: "", message: "Failed" });
  }
  res.send({
    success: true,
    data: {
      wallet,
      mnemonic: wallet.mnemonic.phrase,
      privateKey: wallet.privateKey,
      message: "Success",
    },
  });
};

const getPrivateKey = (req, res, next) => {
  var mnemonicKey = req.body.mnemonic;
  var count = req.body.count;

  if (mnemonicKey == null || mnemonicKey == "") {
    res
      .status(200)
      .json({ isConnected: true, error: true, message: "invalid mnemonic" });
    return;
  } else if (count == null || count == "") {
    res
      .status(200)
      .json({ isConnected: true, error: true, message: "invalid count" });
    return;
  } else if (mnemonicKey != null && count != null) {
    var createWallet = ethers.utils.HDNode.fromMnemonic(mnemonicKey);
    let createdAccount = createWallet.derivePath(
      `m/44'/60'/0'/0/${req.body.count}`
    );
    let mnemonicWalletPvt = createdAccount.privateKey;
    let mnemonicWalletAdd = createdAccount.address;

    loginLogger.log({
      level: "info",
      message: {
        task: "getPrivateKey",
        request: req.body,
        response: {
          privateKey: createdAccount.privateKey,
          address: createdAccount.address,
        },
      },
    });
    res.status(200).json({
      error: false,
      privateKey: mnemonicWalletPvt,
      ethAddress: mnemonicWalletAdd,
    });
  }
};

const importWallet = async (req, res, next) => {
  try {
    var privateKey = req.body.privateKey;
    var mnemonic = req.body.mnemonic;
   //  console.log("ddddddd",privateKey)
    if (privateKey == null && mnemonic == null) {
      return res.status(200).json({ status: false, message: "Invalid input" });
    } else if (privateKey == "" && mnemonic == "") {
      return res.status(200).json({ status: false, message: "Invalid input" });
    }

    if (privateKey != null && privateKey != "") {
      let wallet = new ethers.Wallet(privateKey);
      return res.status(200).json({
        status: true,
        address: wallet.address,
        privateKey: wallet.privateKey,
      });
    }
    if (mnemonic != null && mnemonic != "") {
      let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);

      loginLogger.log({
        level: "info",
        message: {
          task: "importWallet",
          request: req.body,
          response: {
            address: mnemonicWallet.address,
            privateKey: mnemonicWallet.privateKey,
          },
        },
      });
      return res.status(200).json({
        status: true,
        address: mnemonicWallet.address,
        privateKey: mnemonicWallet.privateKey,
      });
    }
  } catch (err) {
    res.status(200).json({ status: false, message: "error" });
  }
};

module.exports = {
  createAddress,
  getPrivateKey,
  importWallet,
};
