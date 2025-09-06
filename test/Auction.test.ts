import { expect } from "chai";
import { network } from "hardhat";
import type { Auction } from "../types/ethers-contracts/Auction.js";

const { ethers, networkHelpers } = await network.connect();

describe("Auction", function () {
    let owner: any;
    let address1: any;
    let address2: any;
    let auction: Auction;

    this.beforeEach(async function () {
        [owner, address1, address2] = await ethers.getSigners();
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

    it("Should place a new bid and become the highest bidder", async function () {
        const itemName = "Item Teste";
        const durationInMinutes = 10;
        await auction.startAuction(itemName, durationInMinutes);

        const bidAmount = ethers.parseEther("1.0");
        await auction.connect(address1).placeBid({ value: bidAmount });

        expect(await auction.highestBidder()).to.equal(address1.address);
        expect(await auction.highestBid()).to.equal(bidAmount);
    });

    it("Should refund the previous highest bidder when a new higher bid is placed", async function () {
        const itemName = "Item Teste";
        const durationInMinutes = 10;
        await auction.startAuction(itemName, durationInMinutes);

        const firstBid = ethers.parseEther("0.5");
        await auction.connect(address1).placeBid({ value: firstBid });

        const secondBid = ethers.parseEther("1");
        const address1BalanceBefore = await ethers.provider.getBalance(address1.address);

        await auction.connect(address2).placeBid({ value: secondBid });

        const address1BalanceAfter = await ethers.provider.getBalance(address1.address);

        expect(address1BalanceAfter).to.be.closeTo(address1BalanceBefore + firstBid, ethers.parseEther("0.001"));
        expect(await auction.highestBidder()).to.equal(address2.address);
        expect(await auction.highestBid()).to.equal(secondBid);
    });

    it("Should revert if the new bid is not higher than the highest bid", async function () {
        const itemName = "Item Teste";
        const durationInMinutes = 10;
        await auction.startAuction(itemName, durationInMinutes);

        const firstBid = ethers.parseEther("1.0");
        await auction.connect(address1).placeBid({ value: firstBid });

        const secondBid = ethers.parseEther("0.5");
        await expect(auction.connect(address2).placeBid({ value: secondBid }))
            .to.be.revertedWith("The bid must be higher");
    });

    it("Should revert if the auction has already ended when placing a bid", async function () {
        const itemName = "Item Teste";
        const durationInMinutes = 10;
        await auction.startAuction(itemName, durationInMinutes);

        await networkHelpers.time.increase(durationInMinutes * 60 + 1);

        const bidAmount = ethers.parseEther("1.0");
        await expect(auction.connect(address1).placeBid({ value: bidAmount }))
            .to.be.revertedWith("The auction has already ended");
    });

    it("Should successfully end the auction and transfer funds to the owner", async function () {
        const itemName = "Item Teste";
        const durationInMinutes = 10;
        await auction.startAuction(itemName, durationInMinutes);

        const bidAmount = ethers.parseEther("1.0");
        await auction.connect(address1).placeBid({ value: bidAmount });

        await networkHelpers.time.increase(durationInMinutes * 60 + 1);

        const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

        const tx = await auction.endAuction();
        const receipt = await tx.wait();

        const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

        expect(ownerBalanceAfter).to.be.closeTo(ownerBalanceBefore + bidAmount, ethers.parseEther("0.001"));
    });

    it("Should revert if auction is not active", async function () {
        await expect(auction.endAuction()).to.be.revertedWith("Auction is not active.");
    });

    it("Should revert if auction has not ended yet", async function () {
        const itemName = "Item Teste";
        const durationInMinutes = 10;
        await auction.startAuction(itemName, durationInMinutes);
        await expect(auction.endAuction()).to.be.revertedWith("Auction has not ended yet.");
    });
});
