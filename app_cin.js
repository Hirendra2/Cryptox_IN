const express = require("express");
const routes = require("./routes/route"); // import the routes
const bodyParser = require("body-parser");
const morganMiddleware = require("./middlewares/morgon");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morganMiddleware);
app.use("/", routes); //to use the routes

const listener = app.listen(8899, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
