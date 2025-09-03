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

    bool public auctionEnded = true;

    constructor() {
        owner = msg.sender;
    }

    event AuctionStarted(address indexed owner, string itemName);

    function startAuction(
        string memory _itemName,
        uint _durantionInMinutes
    ) public {
        require(msg.sender == owner, "Only the owner can start the auction!");

        require(auctionEnded, "Auction must be ended");

        require(bytes(_itemName).length > 0, "Item name cannot be empty");

        auctionEnded = false;
        highestBid = 0;
        highestBidder = address(0);
        startBlock = block.timestamp;
        endBlock = block.timestamp + (_durantionInMinutes * 60);

        emit AuctionStarted(owner, _itemName);
    }
}
