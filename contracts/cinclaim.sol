// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;


contract cinsends {
   
    fallback() external {
        revert();
    }

    receive() external payable {}

    mapping(address => bool) public userList;

    uint256 cinamt =100000000000000000000;
    address private _owner;


   constructor() public {
        _owner = msg.sender;
    }

    function cinsend(address payable user) external {
         require(msg.sender==_owner) ; 
        require(userList[user]==false);
         user.transfer(cinamt);
        userList[user]=true;
    }

     function cin(uint256 amt) public  {  
         require(msg.sender==_owner) ;      
        (bool sent,) = payable(msg.sender).call{value: amt}("");
        require(sent, "failed to send ether");
    }



}



contract fufisends {
   
    fallback() external {
        revert();
    }

    receive() external payable {}

    mapping(address => bool) public userList;

    uint256 cinamt =100000000000000000000;
    address private _owner;


   constructor() public {
        _owner = msg.sender;
    }

    function fufisend(address payable user) external {
         require(msg.sender==_owner) ; 
        require(userList[user]==false);
         user.transfer(cinamt);
        userList[user]=true;
    }

     function fufi(uint256 amt) public  {  
         require(msg.sender==_owner) ;      
        (bool sent,) = payable(msg.sender).call{value: amt}("");
        require(sent, "failed to send ether");
    }



}