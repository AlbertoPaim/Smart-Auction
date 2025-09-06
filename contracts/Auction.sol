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

    modifier ownable() {
        require(msg.sender == owner, "Only the owner can call this function!");
        _;
    }

    event AuctionStarted(address indexed owner, string itemName);
    event NewBid(address indexed bidder, uint amout);
    event AuctionEnded(address indexed winner, uint amount);

    function startAuction(
        string memory _itemName,
        uint _durantionInMinutes
    ) public ownable {
        require(auctionEnded, "Auction must be ended");
        require(bytes(_itemName).length > 0, "Item name cannot be empty");

        itemName = _itemName;
        auctionEnded = false;
        highestBid = 0;
        highestBidder = address(0);
        startBlock = block.timestamp;
        endBlock = block.timestamp + (_durantionInMinutes * 60);

        emit AuctionStarted(owner, _itemName);
    }

    function placeBid() public payable {
        require(!auctionEnded, "The auction should be active");
        require(block.timestamp < endBlock, "The auction has already ended");
        require(msg.value > highestBid, "The bid must be higher");

        address previousHighestBidder = highestBidder;
        uint previousHighestBid = highestBid;

        highestBidder = msg.sender;
        highestBid = msg.value;
        bids[msg.sender] = msg.value;

        if (previousHighestBidder != address(0)) {
            (bool success, ) = payable(previousHighestBidder).call{
                value: previousHighestBid
            }("");

            require(success, "Failed to refund previous bidder.");
        }

        emit NewBid(msg.sender, msg.value);
    }

    function endAuction() public ownable {
        require(!auctionEnded, "Auction is not active.");
        require(block.timestamp >= endBlock, "Auction has not ended yet.");

        auctionEnded = true;

        if (highestBidder != address(0)) {
            (bool success, ) = payable(owner).call{value: highestBid}("");
            require(success, "Failed to transfer funds to owner.");
            emit AuctionEnded(highestBidder, highestBid);
        } else {
            emit AuctionEnded(address(0), 0);
        }
    }
}
