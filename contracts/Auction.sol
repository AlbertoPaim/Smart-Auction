// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Auction {
    address public owner;
    string public itemName;
    uint public startBlock;
    uint public endBlock;
    uint public highestBid;
    address public highestBidder;

    mapping(address => uint) public bids;

    bool public auctionEnded;

    constructor() {
        owner = msg.sender;
    }

    function startAuction(
        string memory _itemName,
        uint _biddingTimeInMinutes
    ) public {
        require(msg.sender == owner);
        itemName = _itemName;
        startBlock = _biddingTimeInMinutes;
    }
}
