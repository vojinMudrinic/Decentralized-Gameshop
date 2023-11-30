// SPDX-License-Identifier: GPL-3.0
import "hardhat/console.sol";
pragma solidity >=0.8.2 <0.9.0;

contract GameShop {

    enum GameStatus { UNAVAILABLE, AVAILABLE, REMOVED }
    event Transaction(address indexed from, uint256 indexed price, uint256 indexed date);
    address owner;
    struct Game {
        uint256 id;
        uint256 price;
        string name;
        string [] keys;
        GameStatus status;
    }
    struct PurchasedGame {
        uint256 price;
        string name;
        string key;
    }
    struct User {
        string name;
        address userAddress;
    }
    Game[] private gameList;
    mapping(address => PurchasedGame[]) customerGames;
    mapping(address => User) public users;
    
    constructor() {
        owner = msg.sender;
    }

    function getOwner() external view returns (address) {
    return owner;
}

    function addGame(string calldata _name, uint256 _price, string[] calldata _keys) external onlyOwner {
        require(_keys.length <= 3, "Max number for serial keys is 3");
        uint256 currentLength = gameList.length;
        Game memory currentGame = Game(currentLength, _price, _name, _keys, GameStatus.AVAILABLE);
        gameList.push(currentGame);
    }

    function removeGame(uint _id) external onlyOwner {
        gameList[_id].status = GameStatus.REMOVED;
    }

    function addSerialKey(string calldata _key, uint256 _gameId ) external onlyOwner {
        require(_gameId < gameList.length, "Game with id does not exist");
        require(gameList[_gameId].status == GameStatus.AVAILABLE || gameList[_gameId].status == GameStatus.UNAVAILABLE, "Invalid game status");
        require(getKeys(_gameId) < 3, "Max number for serial keys is 3");
      
        for(uint256 i = 0; i < gameList[_gameId].keys.length; i++) {
            if(keccak256(abi.encodePacked(gameList[_gameId].keys[i])) == keccak256(abi.encodePacked(_key))){
                revert ("Duplicate serial keys are not allowed");
            }
        }

        gameList[_gameId].keys.push(_key);

        if( gameList[_gameId].status == GameStatus.UNAVAILABLE) {
            gameList[_gameId].status = GameStatus.AVAILABLE;
        }
    }

    function buyGame(uint256 _id) external payable gameAvailable(_id) {
        require(msg.value == gameList[_id].price, "Incorrect Ether amount sent");
        (bool success,) = payable(address(this)).call{value:gameList[_id].price}("");
        require(success, "Payment failed");

        PurchasedGame memory purchasedGame = PurchasedGame(gameList[_id].price, gameList[_id].name, gameList[_id].keys[0]);
        customerGames[msg.sender].push(purchasedGame);
        emit Transaction(msg.sender, gameList[_id].price, block.timestamp);

        for (uint256 i = 0; i < gameList[_id].keys.length - 1; i++) {
            gameList[_id].keys[i] = gameList[_id].keys[i + 1];
        }

        gameList[_id].keys.pop();

        if (gameList[_id].keys.length == 0) {
            gameList[_id].status = GameStatus.UNAVAILABLE;
        }
 
    }

    function claimStoreFunds() external payable onlyOwner {
        require(address(this).balance > 0, "No balance on address");
        (bool success,) = payable(address(owner)).call{value:address(this).balance}("");
        require(success, "Claim failed");
    }

    function getGamesCount() external view returns(uint256) {
        return gameList.length;
    }

    function getGameInfo(uint256 _index) external view returns (string memory name, uint256 keys, uint256 price, GameStatus status, uint256 id ) {
        return (gameList[_index].name, getKeys(_index), gameList[_index].price, gameList[_index].status, gameList[_index].id);
    }

    function getCustomerGames() public view  returns (PurchasedGame[] memory) {
        return customerGames[msg.sender];
    }

    function getKeys(uint256 gameId) public view returns (uint256) {
        return gameList[gameId].keys.length;
    }

     function getContractBalance() public view  returns (uint256) {
        return address(this).balance;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Permission denied");
        _;
    }

    modifier gameAvailable(uint256 _id) {
        require( gameList[_id].status == GameStatus.AVAILABLE, "Game is not available");
        _;
    }

    receive() external payable {
        console.log("Contract received Ether!");
    }
}