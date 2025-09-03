import { expect } from "chai";
import { network } from "hardhat";
import type { Auction } from "../types/ethers-contracts/Auction.js";

const { ethers } = await network.connect();

describe("Auction", function () {
    let owner
    let address1
    let auction: Auction;

    this.beforeEach(async function () {
        [owner, address1] = await ethers.getSigners();
        auction = await ethers.deployContract("Auction", []);
    });

    it("Should successfully start a new auction", async function () {
        const itemName = "Item Teste";
        const durationInMinutes = 10;

        await auction.startAuction(itemName, durationInMinutes);

        expect(await auction.auctionEnded()).to.be.false;
        expect(await auction.itemName()).to.equal(itemName);
        expect(await auction.highestBid()).to.equal(0);
        expect(await auction.highestBidder()).to.equal(ethers.ZeroAddress);
    });

});