const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameShop Contract", function () {
  let owner;
  let gameShop;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const GameShop = await ethers.getContractFactory("GameShop");
    gameShop = await GameShop.deploy();
  });

  it("Should deploy the contract and set the owner", async function () {
    expect(await gameShop.getOwner()).to.equal(owner.address);
  });

  it("Should add a game to the list", async function () {
    // Add game to the list
    await gameShop.addGame("Test Game", 100, ["key1", "key2"]);

    // Get the count of games after addition
    const gamesCount = await gameShop.getGamesCount();

    // Assert that the count is 1
    expect(gamesCount).to.equal(1);
  });

  it("Should not allow non-owner to add a game", async function () {
    // Create a new random signer to simulate a non-owner
    const nonOwner = ethers.Wallet.createRandom().connect(ethers.provider);

    // Attempt to add a game with the non-owner signer
    await expect(
      gameShop.connect(nonOwner).addGame("Test Game", 100, ["key1", "key2"])
    ).to.be.revertedWith("Permission denied");
  });

  it("Should remove a game from the list", async function () {
    const gameName = "Test Game";
    const gamePrice = ethers.parseEther("0.1");
    const gameKeys = ["key1", "key2"];

    await gameShop.addGame(gameName, gamePrice, gameKeys);
    await gameShop.removeGame(0);
    const gameInfo = await gameShop.getGameInfo(0);

    expect(gameInfo.status).to.equal(2); // GameStatus.REMOVED
  });

  it("Should not allow non-owner to remove a game", async function () {
    // Create a new signer to simulate a non-owner
    const nonOwner = ethers.Wallet.createRandom().connect(ethers.provider);

    // Attempt to remove a game with the non-owner signer
    await expect(gameShop.connect(nonOwner).removeGame(0)).to.be.revertedWith(
      "Permission denied"
    );
  });

  it("Should add a serial key to a game", async function () {
    const gameName = "Test Game";
    const gamePrice = ethers.parseEther("0.1");
    const gameKeys = ["key1", "key2"];

    await gameShop.addGame(gameName, gamePrice, gameKeys);
    await gameShop.addSerialKey("key3", 0); // Use index 0

    const gameInfo = await gameShop.getGameInfo(0);

    expect(gameInfo[1]).to.equal(3);
  });

  it("Should not allow duplicate serial keys", async function () {
    const gameName = "Test Game";
    const gamePrice = ethers.parseEther("0.1");
    const gameKeys = ["key1", "key2"];

    await gameShop.addGame(gameName, gamePrice, gameKeys);

    await expect(gameShop.addSerialKey("key1", 0)).to.be.revertedWith(
      "Duplicate serial keys are not allowed"
    );
  });

  it("Should not allow non-owner to add a serial key", async function () {
    const gameName = "Test Game";
    const gamePrice = ethers.parseEther("0.1");
    const gameKeys = ["key1", "key2"];

    await gameShop.addGame(gameName, gamePrice, gameKeys);

    // Create a new random signer to simulate a non-owner
    const nonOwner = ethers.Wallet.createRandom().connect(ethers.provider);

    // Attempt to add a serial key with the non-owner signer
    await expect(
      gameShop.connect(nonOwner).addSerialKey("key3", 0)
    ).to.be.revertedWith("Permission denied");
  });

  it("Should not allow a user to buy a game with incorrect Ether amount", async function () {
    const gameName = "Test Game";
    const gamePrice = ethers.parseEther("100");

    await gameShop.addGame(gameName, gamePrice, ["key1", "key2"]);

    // Create a new random signer to simulate a user
    const user = ethers.Wallet.createRandom().connect(ethers.provider);

    // Fund the user's address with some Ether (but not the correct game price)
    await owner.sendTransaction({
      to: user.address,
      value: ethers.parseEther("50"), // Sending an incorrect amount
    });

    // Attempt to buy a game with the user's signer
    await expect(gameShop.connect(user).buyGame(0)).to.be.revertedWith(
      "Incorrect Ether amount sent"
    );
  });

  it("Should not allow a user to buy an unavailable game", async function () {
    const gameName = "Test Game";
    const gamePrice = ethers.parseEther("0.1");
    const gameKeys = ["key1", "key2"];

    await gameShop.addGame(gameName, gamePrice, gameKeys);
    await gameShop.removeGame(0);

    const user = ethers.Wallet.createRandom().connect(ethers.provider);

    await expect(
      gameShop.connect(user).buyGame(0, { value: gamePrice, from: user })
    ).to.be.revertedWith("Game is not available");
  });

  it("Should not allow non-owner to claim store funds", async function () {
    const nonOwner = ethers.Wallet.createRandom().connect(ethers.provider);
    await expect(
      gameShop.connect(nonOwner).claimStoreFunds()
    ).to.be.revertedWith("Permission denied");
  });
});
