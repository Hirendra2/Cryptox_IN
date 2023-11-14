const winston = require("winston");
const { createLogger, format, transports, config } = require("winston");
const { combine, timestamp, printf, prettyPrint } = format;
require("winston-daily-rotate-file");
var moment = require("moment");
var path = require("path");

// you have only 7 level in winston like ===> 1-error,2-warn,3-info,4-http,5-verbose,6-debug,7-silly

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "logs/rotate-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  // datePattern: "MMM-DD-YYYY",
  // datePattern: "YYYY-MM-DD-THH-mm",
  filename: path.join(__dirname, "rotate_logs", "log_file.log"),
  format: format.combine(format.timestamp(), format.json()),
  maxFiles: "15d",
});

const errorRotateTransport = new transports.DailyRotateFile({
  filename: "logs/rotate-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  // datePattern: "MMM-DD-YYYY",
  // datePattern: "YYYY-MM-DD-THH-mm",
  filename: path.join(__dirname, "rotate_logs", "error_file.log"),
  format: format.combine(format.timestamp(), format.json()),
  maxFiles: "15d",
});

//###############------Configuration----####################//
const errorConfiguration = {
  level: "error",
  format: combine(
    timestamp({
      format: () => {
        return moment().utcOffset("+0530").format("MMM-DD-YYYY HH:mm:ss.SSSS");
      },
    }),
    prettyPrint()
  ),
  transports: [
    errorRotateTransport,
    // new winston.transports.Console(),
    new winston.transports.File({
      level: "error",
      filename: "logs/error.log", //for error purpose check
    }),
  ],
};

const loginConfiguration = {
  // level: "info",
  format: combine(
    timestamp({
      format: () => {
        return moment().utcOffset("+0530").format("MMM-DD-YYYY HH:mm:ss.SSSS");
      },
    }),
    prettyPrint()
  ),
  transports: [
    fileRotateTransport,
    // new winston.transports.Console(),
    new winston.transports.File({
      level: "info",
      filename: "logs/login.log", //for login purpose check
    }),
  ],
};

const postConfiguration = {
  level: "info",
  format: combine(
    timestamp({
      format: () => {
        return moment().utcOffset("+0530").format("MMM-DD-YYYY HH:mm:ss.SSSS");
      },
    }),
    prettyPrint()
  ),
  transports: [
    fileRotateTransport,
    // new winston.transports.Console(),
    new winston.transports.File({
      level: "info",
      filename: "logs/post.log", //for buying purpose check
    }),
  ],
};

const bonusConfiguration = {
  level: "info",
  format: combine(
    timestamp({
      format: () => {
        return moment().utcOffset("+0530").format("MMM-DD-YYYY HH:mm:ss.SSSS");
      },
    }),
    prettyPrint()
  ),
  transports: [
    fileRotateTransport,
    // new winston.transports.Console(),
    new winston.transports.File({
      level: "info",
      filename: "logs/bonus.log", //for buying purpose check
    }),
  ],
};

const burnConfiguration = {
  level: "info",
  format: combine(
    timestamp({
      format: () => {
        return moment().utcOffset("+0530").format("MMM-DD-YYYY HH:mm:ss.SSSS");
      },
    }),
    prettyPrint()
  ),
  transports: [
    fileRotateTransport,
    // new winston.transports.Console(),
    new winston.transports.File({
      level: "info",
      filename: "logs/burn.log", //for buying purpose check
    }),
  ],
};

const rewardConfiguration = {
  level: "info",
  format: combine(
    timestamp({
      format: () => {
        return moment().utcOffset("+0530").format("MMM-DD-YYYY HH:mm:ss.SSSS");
      },
    }),
    prettyPrint()
  ),
  transports: [
    fileRotateTransport,
    // new winston.transports.Console(),
    new winston.transports.File({
      level: "info",
      filename: "logs/reward.log", //for buying purpose check
    }),
  ],
};

const referralConfiguration = {
  level: "info",
  format: combine(
    timestamp({
      format: () => {
        return moment().utcOffset("+0530").format("MMM-DD-YYYY HH:mm:ss.SSSS");
      },
    }),
    prettyPrint()
  ),
  transports: [
    fileRotateTransport,
    // new winston.transports.Console(),
    new winston.transports.File({
      level: "info",
      filename: "logs/referral.log", //for buying purpose check
    }),
  ],
};

const followConfiguration = {
  level: "info",
  format: combine(
    timestamp({
      format: () => {
        return moment().utcOffset("+0530").format("MMM-DD-YYYY HH:mm:ss.SSSS");
      },
    }),
    prettyPrint()
  ),
  transports: [
    fileRotateTransport,
    // new winston.transports.Console(),
    new winston.transports.File({
      level: "info",
      filename: "logs/follow.log", //for buying purpose check
    }),
  ],
};

//$$$$$$$$$$$$$$$$$$$$$$$$----Logger creation ----- @@@@@@@@@@@@@@@//

const errorLogger = winston.createLogger(errorConfiguration); //error check
const loginLogger = winston.createLogger(loginConfiguration); //login info check
const postLogger = winston.createLogger(postConfiguration); //buyer warn check
const bonusLogger = winston.createLogger(bonusConfiguration); //buyer warn check
const rewardLogger = winston.createLogger(rewardConfiguration); //buyer warn check
const referralLogger = winston.createLogger(referralConfiguration); //buyer warn check
const followLogger = winston.createLogger(followConfiguration); //buyer warn check
const burnLogger = winston.createLogger(burnConfiguration); //buyer warn check

module.exports = {
  loginLogger,
  postLogger,
  errorLogger,
  bonusLogger,
  rewardLogger,
  referralLogger,
  followLogger,
  burnLogger,
};
