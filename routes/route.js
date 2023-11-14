const express = require('express');
const router  = express.Router();
const cryptoxinAPI = require('../cryp');
const profileupdateAPI = require('../profileupdate');
const walletAPI = require('../wallet.js');
const Followapi = require('../Follow.js');
const balanceapi = require('../balance.js');
const fufiapi = require('../ff.js');


router.post('/cinsend', balanceapi.cinsend);
router.post('/balance', balanceapi.balance);
router.post('/getxhs', balanceapi.getxhs);
router.post('/singupbonace', balanceapi.singupbonace);
router.post('/cintotalsupply', balanceapi.cintotalsupply);
router.get('/balances', balanceapi.balances);


router.post('/withs', fufiapi.withs);


router.post('/createAddress', walletAPI.createAddress);
router.post('/getPrivateKey', walletAPI.getPrivateKey);
router.post('/importWallet', walletAPI.importWallet);
router.post('/ragistration', cryptoxinAPI.ragistration);
router.post('/getUser', cryptoxinAPI.getUser);
router.post('/profileupdate', profileupdateAPI.profileupdate);
router.post('/getprofiles', profileupdateAPI.getprofiles);
router.post('/User', profileupdateAPI.User);
router.post('/getUserCount', profileupdateAPI.getUserCount);
router.post('/updatebackgroundimgg', profileupdateAPI.updatebackgroundimgg);


router.post('/DailycheckinBonas', cryptoxinAPI.DailycheckinBonas);
router.post('/createPost', cryptoxinAPI.createPost);
router.post('/getPost', cryptoxinAPI.getPost);
router.post('/getpostbyid', cryptoxinAPI.getpostbyid);
router.post('/getallmembersRe', cryptoxinAPI.getallmembersRe);


router.post('/editPost', cryptoxinAPI.editPost);
router.post('/banPost', cryptoxinAPI.banPost);
router.post('/deletePost', cryptoxinAPI.deletePost);
router.post('/likePost', cryptoxinAPI.likePost);
router.post('/dislikePost', cryptoxinAPI.dislikePost);

router.post('/createComment', cryptoxinAPI.createComment);
router.post('/getComments', cryptoxinAPI.getComments);
router.post('/getreferralRehistory', cryptoxinAPI.getreferralRehistory);
router.post('/getreferralreward', cryptoxinAPI.getreferralreward);
router.post('/getparentrewardss', cryptoxinAPI.getparentrewardss);
router.post('/getBonasRe', cryptoxinAPI.getBonasRe);
router.post('/getListReferrals', cryptoxinAPI.getListReferrals);
router.post('/getdirectReferralscount', cryptoxinAPI.getdirectReferralscount);
router.post('/getpostreward', cryptoxinAPI.getpostreward);
router.post('/getlikerewards', cryptoxinAPI.getlikerewards);
router.post('/getCommentreward', cryptoxinAPI.getCommentreward);
router.post('/getallUserr', cryptoxinAPI.getallUserr);
router.post('/getUser1', cryptoxinAPI.getUser1);
router.post('/getallPost', cryptoxinAPI.getallPost);
router.post('/usernameAvailable', cryptoxinAPI.usernameAvailable);
router.post('/nextbonustime', cryptoxinAPI.nextbonustime);
router.post('/onetimereward', cryptoxinAPI.onetimereward);
router.post('/totalcheckinBonas', cryptoxinAPI.totalcheckinBonas);
router.post('/sumpostreward', cryptoxinAPI.sumpostreward);
router.post('/sumCommentreward', cryptoxinAPI.sumCommentreward);
router.post('/sumlikereward', cryptoxinAPI.sumlikereward);
router.post('/sumparentreward', cryptoxinAPI.sumparentreward);
router.post('/getTotalReferralscount', cryptoxinAPI.getTotalReferralscount);

router.post('/getallUser', cryptoxinAPI.getallUser);
router.post('/updatereferral', cryptoxinAPI.updatereferral);
router.post('/gethashtag', cryptoxinAPI.gethashtag);
router.post('/getLike', cryptoxinAPI.getLike);
router.post('/Search', cryptoxinAPI.Search);
router.post('/reportPost', cryptoxinAPI.reportPost);
router.post('/getusername', cryptoxinAPI.getusername);

router.post('/CommentonComment', cryptoxinAPI.CommentonComment);
router.post('/getCommentonomment', cryptoxinAPI.getCommentonomment);


router.post('/Follow', Followapi.Follow);
router.post('/getFollowers', Followapi.getFollowers);
router.post('/getFollowing', Followapi.getFollowing);
router.post('/getNoOffFollowers', Followapi.getNoOffFollowers);
router.post('/getNoOffFollowing', Followapi.getNoOffFollowing);
router.post('/UnFollow', Followapi.UnFollow);
router.post('/checkusernamessss', Followapi.checkusernamessss);
router.post('/changeUsername', Followapi.changeUsername);
router.post('/UnFollowlist', Followapi.UnFollowlist);
router.post('/testUnFollowlistss', Followapi.testUnFollowlistss);
router.post('/getFollowingPost', Followapi.getFollowingPost);

router.get('/getFollowings', Followapi.getFollowings);
router.post('/checkFolloweruser', Followapi.checkFolloweruser);





module.exports = router;