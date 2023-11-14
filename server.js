const port = process.env.PORT || 6000;
const express = require("express");
const multer = require("multer");
const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const dirPath = path.join(__dirname, "images");
const { createPost } = require("./cryp");
const { updateprofileimg } = require("./profileupdate");
const { updatebackgroundimgg } = require("./profileupdate");
const { getprofiless } = require("./profileupdate");


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
 

 console.log("pppppppp",myAddress)
  var s = " ";
  const array = req.files;
 console.log("NEW POST >>>>>>>>>>>")
  for (let x = 0; x < array.length; x++) {
    let _imghashs = "http://165.22.217.204:6000/images/";
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
        console.log("updateprofileimgeeeeeeeee", e);
      });
    }) .catch((e) => {
      console.log("eeeeeegetprofiless", e);
    });
  } else if (type == "2") {
    let backgroundimgg = s;
    console.log(backgroundimgg);
    getprofiless(myAddress).then(async (r) => {
      console.log("getprofiless***********", r);
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
        console.log("updatebackgroundimgg***********", re);
        res.status(201).send(re);
      })
      .catch((e) => {
        console.log("updatebackgroundimggeeeeeeeee", e);
      });
    }).catch((e) => {
      console.log("eeeegetprofiless", e);
    });
  }else if(type == "3"){
    let _imghash="0"
    createPost(myAddress, privateKey, _hashtag, _content, _imghash,videoHash)
      .then(async (re) => {
        console.log("createPost***********", re);
        res.status(201).send({ msg:re });
      })
      .catch((e) => {
        console.log("createPosteeeeeeee", e);
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
        console.log("createPost***********", re);
     
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
