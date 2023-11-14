// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.8.17;
pragma abicoder v2;
import "@openzeppelin/contracts/utils/Counters.sol";

library SafeMath { 
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        return c;
    }
}



contract cry {
        using SafeMath for uint256;

    address payable public owner; 
       address[] public getuser; 
    constructor()  {
          _owner = msg.sender;
    }

    fallback() external {
        revert();
    }

    receive() external payable {}
    struct Profile {
        string Name;
        string UserName;
        string Organization;
        string designation;
        string Dobss;
        string ProfileTag;
        string MailID; 
        string Otherdetail;
        uint256 time;  
        string Profileimgg;
        string backgroundimgg;
        address useraddress;
    }
    Profile profile;
    mapping(address => Profile) public profiles;
    mapping(address=>string) public usernames;
    mapping(address=>bool) public isuser;
    string[] public allusernames ;


    function updeteprofile( string memory  Name,  string memory Organization,string memory designation,string memory Dobss, string memory ProfileTag, string memory MailID, string memory Otherdetail,string memory Profileimgg ,string memory backgroundimgg) public returns (bool success) {
       string memory UserName = usernames[msg.sender];
        profiles[msg.sender] = Profile( Name, UserName,Organization, designation,Dobss, ProfileTag,MailID,Otherdetail, block.timestamp,Profileimgg,backgroundimgg ,msg.sender);
        return success;
    }
    function changeUsername(string memory _username) public {
        usernames[msg.sender]=_username;
        allusernames.push(_username);
    }


    function checkusername()  public view returns (string[] memory ){
        return allusernames;
    }

    struct Post {
        uint256 allpstId;
        address author;
        string hashtag;
        string content;
        string  imgHash;
        string  videoHash;
        uint256 timestamp;
        uint256 likeCount;
        uint256 CommentCount;
        uint256 reportCount;
        string username;
        string Name;
        string ProfileTag;
        uint256 dislikeCount;
    }

    struct AllPost {
        uint256 allpstId;
        address author;
        string hashtag;
        string content;
        string imgHash;
        string  videoHash;
        uint256 timestamp;
        uint256 likeCount;
        uint256 CommentCount;
        uint256 reportCount;
        string usernames;
        string Name;
        string ProfileTag;
        uint256 dislikeCount;

    }

    struct Comment{
        uint commentId;
        address author;  
        uint postId;
        string content;
        uint likeCount;
        uint reportCount;
        uint timestamp;
        cdStatus status;
    }
    mapping(uint256 => AllPost) public AllPostIds;
    mapping(address => uint256[])  AllPosts;

    mapping(uint256 => Post) public pstIds;

    mapping(address => uint256[]) private userPosts;
    event logpostCreated(address author, uint256 postid, string hashtag);
    uint256 public totalposts = 0;
    uint256 public totalComments = 0;
    uint256 public totalUsers = 0;
    uint256 public alltotalposts = 0;
   
    address alll = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
  
    function createPost( string memory _hashtag,string memory _content, string memory  _imghash ,string memory videoHash) public {
        totalposts = totalposts.add(1);
        uint256 id = totalposts;
       string memory username = usernames[msg.sender];
         string memory Profileimgg= profiles[msg.sender].Profileimgg;
       string memory name = profiles[msg.sender].Name;
        pstIds[id] = Post(id,msg.sender, _hashtag, _content, _imghash,videoHash,  block.timestamp,  0,0, 0,username,name,Profileimgg, 0);
        userPosts[msg.sender].push(totalposts);
        alltotalposts = alltotalposts.add(1);
        uint256 ids = alltotalposts;
        AllPostIds[ids] = AllPost(ids,msg.sender, _hashtag, _content, _imghash,videoHash,  block.timestamp,  0,0,  0,username,name,Profileimgg, 0 );
        AllPosts[alll].push(alltotalposts);
        emit logpostCreated(msg.sender, totalposts, _hashtag);
       
    }

    function getUserPosts(address _user)  public view returns (uint256[] memory postList){
        return userPosts[_user];
    }

    function getallPosts(address _user)  public view returns (uint256[] memory allpostList){
        return AllPosts[_user];
    }

    event logpostBanned(uint256 id, string hashtag, uint256 maintainer);
    enum cdStatus { NP, Active, Banned, Deleted } 
    event logpostDeleted(uint256 id, string hashtag);


    function editPost(uint256 _id,string memory _hashtag,string memory _content, string memory _imghash ,string memory videoHash ) public {
        pstIds[_id].hashtag = _hashtag;
        pstIds[_id].content = _content;
        pstIds[_id].imgHash = _imghash;
        pstIds[_id].videoHash = videoHash;
        AllPostIds[_id].hashtag = _hashtag;
        AllPostIds[_id].content = _content;
        AllPostIds[_id].imgHash = _imghash;
        AllPostIds[_id].videoHash = videoHash;
    }

    function deletePost(uint256 _id) public {
        require(pstIds[_id].author==msg.sender,"You are not ");
        emit logpostDeleted(_id, pstIds[_id].hashtag);
        delete pstIds[_id];
       
         delete AllPostIds[_id];
    }

    struct like {
        uint256 likeId;
        uint256 postId;
        string name;
        string username;
        string Profileimgg;
        address useraddress;
        uint256 timestamp;
    }
 
    mapping(uint256=>like[]) private likes;
    mapping(uint256 => address[]) private  postLikersList;
    mapping(uint256 => mapping(address => bool)) private  postLikers;
    mapping(uint256 => address[]) private  allpostLikersList;
    mapping(uint256 => mapping(address => bool))  allpostLikers;
    

    struct dislike {
        uint256 likeId;
        uint256 postId;
        string name;
        string username;
        string Profileimgg;
        address useraddress;
        uint256 timestamp;
    }
 
    mapping(uint256=>dislike[]) private dislikes;


   function likePost(uint256 _id) public {
        string memory username = usernames[msg.sender];
        string memory name = profiles[msg.sender].Name;
        string memory Profileimgg = profiles[msg.sender].Profileimgg;
        pstIds[_id].likeCount = pstIds[_id].likeCount.add(1);
        postLikers[_id][msg.sender] = true;
        AllPostIds[_id].likeCount = AllPostIds[_id].likeCount.add(1);
        allpostLikers[_id][msg.sender] = true;
        _tokenIds.increment();
        uint256 msgId = _tokenIds.current();
        like memory newMsg = like( msgId,_id, name,username,Profileimgg,msg.sender,block.timestamp );
        likes[_id].push(newMsg);
    }

    function dislikePost(uint256 _id) public {
        string memory username = usernames[msg.sender];
        string memory name = profiles[msg.sender].Name;
        string memory Profileimgg = profiles[msg.sender].Profileimgg;
        pstIds[_id].dislikeCount = pstIds[_id].dislikeCount.add(1);
        postLikers[_id][msg.sender] = true;
        AllPostIds[_id].dislikeCount = AllPostIds[_id].dislikeCount.add(1);
        allpostLikers[_id][msg.sender] = true;
        _tokenIds.increment();
        uint256 msgId = _tokenIds.current();
        dislike memory newMsg = dislike( msgId,_id, name,username,Profileimgg,msg.sender,block.timestamp );
        dislikes[_id].push(newMsg);
    }

    function getLike(uint256 postId) external view returns (like[] memory) {
        return likes[postId];
    }

    function getreportCount(uint _id) public  view returns ( address author, uint256 reportCount){
        return (AllPostIds[_id].author, AllPostIds[_id].reportCount);
    }

    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    struct message {
        uint256 msgId;
        uint256 postId;
        string username;
        string name;
        address useraddress;
        string messages;
        string profile;
        uint256 likeCount;
        uint256 totalComments;
        uint256 timestamp;
    }

    mapping(uint256=>message[]) private allMessages;
    mapping(uint256 => address[]) private  postsCommentList;
    mapping(uint256 => mapping(address => bool)) private postComment;
    mapping(uint256 => address[]) private  allpostCommentList;
    mapping(uint256 => mapping(address => bool)) private allpostComment;

    mapping(uint256 => message) public messageid;

    uint256 public createCommentid=0;
    function createComment(uint256 postId,string memory _messages) external {
        pstIds[postId].CommentCount = pstIds[postId].CommentCount.add(1);
        AllPostIds[postId].CommentCount = AllPostIds[postId].CommentCount.add(1);
        uint256 msgId=  createCommentid++;
        string memory username = usernames[msg.sender];
        string memory profiless = profiles[msg.sender].Profileimgg;
        string memory name = profiles[msg.sender].Name;
        message memory newMsg = message( msgId,postId, username,name,msg.sender,_messages,profiless,0,0,block.timestamp );
        allMessages[postId].push(newMsg);
        messageid[postId] = message(msgId,postId, username,name,msg.sender,_messages,profiless,0,0,block.timestamp );
    }


    function getComment(uint256 _index) public view returns (message[] memory) {
        message[] memory messageToReturn = allMessages[_index];
        return (messageToReturn);
    }
    function readComment(uint256 postId) external view returns (message[] memory) {
        return allMessages[postId];
    }



 

    struct CommentComments {
        uint256 msgId;
        uint256 CommentId;
        string username;
        string name;
        string messages;
        string profile;
        uint256 timestamp;
    }

    mapping(uint256=>CommentComments[])  allCommentComments;
    uint public CommentCommentsid=0;

    mapping(uint256=>uint256) public CommentCommentcount;

    function CommentComment(uint256 CommentId,string memory _messages) external {
        messageid[CommentId].totalComments = messageid[CommentId].totalComments.add(1);
        uint256 msgId= CommentCommentsid++;
        string memory username = usernames[msg.sender];
        string memory profiless = profiles[msg.sender].Profileimgg;
        string memory name = profiles[msg.sender].Name;
        CommentComments memory newMsg = CommentComments( msgId,CommentId, username,name,_messages,profiless,block.timestamp );
        allCommentComments[CommentId].push(newMsg);
        CommentCommentcount[CommentId]++;

    }
    function readCommentComment(uint256 CommentId) external view returns (CommentComments[] memory) {
        return allCommentComments[CommentId];
    }

    address public _owner;
  

    mapping(uint=>mapping(address=>bool)) private postReporters;
    mapping(address=>uint[]) private userReportList;
    uint private noOfReportsRequired=1;
    uint[] private pstIdsReportedList;
    event logpostReported(uint id, string hashtag);


    function reportPost(uint _postId) public payable{
        require(!postReporters[_postId][msg.sender],"You have already Reported!");
        postReporters[_postId][msg.sender]=true;
        userReportList[msg.sender].push(_postId);
         pstIds[_postId].reportCount=pstIds[_postId].reportCount.add(1);
         AllPostIds[_postId].reportCount=AllPostIds[_postId].reportCount.add(1);
        uint reports= pstIds[_postId].reportCount;
        if(reports==noOfReportsRequired){
          pstIdsReportedList.push(_postId);
          emit logpostReported(_postId, pstIds[_postId].hashtag);
        }
    }
    function ownerdeletePost(uint256 _id) public {
        require(msg.sender==owner,"You are not owner!");
        emit logpostDeleted(_id, pstIds[_id].hashtag);
        delete pstIds[_id];
        delete AllPostIds[_id];
    }

    function Profiledelete(address _ad) public {
       require(block.timestamp > locktime[msg.sender], "Lock time not expired");
       require(msg.sender==owner,"You are not owner!");
        delete(profiles[_ad]);
        }

    struct requestforProfile {
        address useraddress;
        string resion;
        bool hs;
        uint256 timestamp;
    }


        mapping(address => requestforProfile[])  requestforProfiledeletes;
        mapping(address => uint256) public locktime;

        function requestforProfiledelete(string memory resion) public {
            require(msg.sender==profiles[msg.sender].useraddress,"You are not owner!");
            requestforProfile memory Re = requestforProfile( msg.sender,resion, true, block.timestamp );
            requestforProfiledeletes[msg.sender].push(Re); 
            locktime[msg.sender]=block.timestamp;
        }

        function withrequestforProfiledelete(string memory resion) public {
            require(msg.sender==profiles[msg.sender].useraddress,"You are not owner!");
            requestforProfile memory Re = requestforProfile( msg.sender,resion, false, block.timestamp);
            requestforProfiledeletes[msg.sender].push(Re);
        }

        function getrequestforProfiledelete(address user) external view returns (requestforProfile[] memory) {
          return requestforProfiledeletes[user];
    }

}
