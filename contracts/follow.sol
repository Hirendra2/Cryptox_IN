pragma solidity ^0.7.0;

contract Follows {
    mapping(address => uint256) public getNoFFFollows;
    mapping(address => uint256) public getNoFFollowing;
    mapping(address => address[]) private allFollow;
    mapping(address => address[]) private allFollowing;

    function Follow(address friends) public {  
        allFollowing[msg.sender].push(friends);
        allFollow[friends].push(msg.sender);
        getNoFFFollows[friends] += 1;
        getNoFFollowing[msg.sender] += 1;
    }

function UnFollow(address friends) public {
    uint256 length = allFollowing[msg.sender].length;
    for (uint256 i = 0; i < length; i++) {        
        if (allFollowing[msg.sender][i] == friends) {
            allFollowing[msg.sender][i] = allFollowing[msg.sender][length - 1];
            allFollowing[msg.sender].pop();
            
            uint256 friendIndex = getFriendIndex(allFollow[friends], msg.sender);
            if (friendIndex < allFollow[friends].length) {
                allFollow[friends][friendIndex] = allFollow[friends][allFollow[friends].length - 1];
                allFollow[friends].pop();
            }
            getNoFFFollows[friends] -= 1;
            getNoFFollowing[msg.sender] -= 1;
            break;
        }
    }
}

function getFriendIndex(address[] memory friendsArray, address friend) private pure returns (uint256) {
    uint256 length = friendsArray.length;
    for (uint256 i = 0; i < length; i++) {
        if (friendsArray[i] == friend) {
            return i;
        }
    }
    return length;
}


    function getallFollowing(address user) external view returns (address[] memory) {         
        return allFollowing[user];
    }

    function getallFollow(address user) external view returns (address[] memory) {         
        return allFollow[user];
    }
}
