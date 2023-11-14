// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract referrals {
    mapping(address => bool) public isuser;
    address[] public getuser;

    address private _owner;

    fallback() external {
        revert();
    }

    receive() external payable {}

    constructor() public {
        _owner = msg.sender;
    }

    uint256 public lastMember;
    event eventNewUser(address _mod, address _member, address _ref_add);
    mapping(address => uint256) public referralreward;
    uint256 referralamt;
    mapping(address => address[]) parentss;
    mapping(address => address) public parent_info;
    mapping(address => uint256) totaldirect;

    struct referralRe {
        address _ref_add;
        address _member;
        uint256 amt;
        uint256 timestamp;
    }

    mapping(address => referralRe[]) allreferralRe;

    function parent(address childs, address[] memory allparent) public {
        require(_owner == msg.sender);
        parentss[childs] = allparent;
    }

    function updatereferral(uint256 referralamts) public {
        require(_owner == msg.sender);

        referralamt = referralamts;
    }

    function ragistration(address user) public {
        getuser.push(user);
        isuser[msg.sender] = true; // Attack Prevented
    }

    mapping(address => address[]) private childsadd;

    function referral(address payable _ref_add, address _member)
        public
        payable
    {
        require(msg.sender == _member, "You are not user");
        require(isuser[msg.sender] == false, "You are not user");
        isuser[msg.sender] = true;
        totaldirect[_ref_add] += 1;
        childsadd[_ref_add].push(_member);
        getuser.push(_member);
        parent_info[_member] = _ref_add;
        lastMember++;
        emit eventNewUser(_member, _member, _ref_add);
        referralreward[_ref_add] += referralamt;
        referralreward[_member] += referralamt;
        referralRe memory Re = referralRe(
            _ref_add,
            _member,
            referralamt,
            block.timestamp
        );
        allreferralRe[_ref_add].push(Re);
        _ref_add.transfer(referralamt);
        (bool sent, ) = payable(msg.sender).call{value: referralamt}("");
        require(sent, "failed to send ether");
    }

    function ownerreferral(address payable _ref_add, address _member)
        public
        payable
    {
        require(isuser[_member] == false, "You are not user");
        isuser[_member] = true;
        totaldirect[_ref_add] += 1;
        childsadd[_ref_add].push(_member);
        getuser.push(_member);
        parent_info[_member] = _ref_add;
        lastMember++;
        emit eventNewUser(_member, _member, _ref_add);
        referralreward[_ref_add] += referralamt;
        referralreward[_member] += referralamt;
        referralRe memory Re = referralRe(
            _ref_add,
            _member,
            referralamt,
            block.timestamp
        );
        allreferralRe[_ref_add].push(Re);
        _ref_add.transfer(referralamt);
        (bool sent, ) = payable(_member).call{value: referralamt}("");
        require(sent, "failed to send ether");
    }

    function deletemember(address _ref_add, address cc) public {
        uint16 length = uint16(childsadd[_ref_add].length);
        for (uint256 i = 0; i < length; i++) {
            if (childsadd[_ref_add][i] == cc) {
                isuser[cc] = false;
                delete childsadd[_ref_add][i];
                totaldirect[_ref_add] -= 1;

                break;
            }
        }
    }

    function getListReferrals(address addr)
        public
        view
        returns (address[] memory)
    {
        return childsadd[addr];
    }

    function getallmembersRe(address _ref_add)
        external
        view
        returns (referralRe[] memory)
    {
        return allreferralRe[_ref_add];
    }

    function getTotalReferralscount(address user)
        public
        view
        returns (uint256)
    {
        return totaldirect[user];
    }
    function getparentss(address user)
        external
        view
        returns (address[] memory)
    {
        return parentss[user];
    }

    function getUserr() external view returns (address[] memory) {
        return getuser;
    }

    mapping(address => uint256) public DalycheckinBonas;
    mapping(address => uint256) public lockTime;
    uint256 public Bonasam;

    struct Bonas {
        address username;
        uint256 ant;
        uint256 timestamp;
    }

    mapping(address => Bonas[]) allBonas;

    function updateBonas(uint256 Bonasamt) public {
        Bonasam = Bonasamt;
    }

    function checkin(uint256 locktimes) public payable {
        require(
            block.timestamp > lockTime[msg.sender],
            "Lock time not expired"
        );
        Bonas memory Bonasrewards = Bonas(msg.sender, Bonasam, block.timestamp);
        allBonas[msg.sender].push(Bonasrewards);
        (bool sent, ) = payable(msg.sender).call{value: Bonasam}("");
        require(sent, "failed to send ether");
        DalycheckinBonas[msg.sender] += Bonasam;
        lockTime[msg.sender] = block.timestamp + locktimes;
    }

    function getBonasRe(address user) external view returns (Bonas[] memory) {
        return allBonas[user];
    }

    function cin(uint256 amt) public {
        require(msg.sender == _owner);
        (bool sent, ) = payable(msg.sender).call{value: amt}("");
        require(sent, "failed to send ether");
    }
}