// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "./Bidding.sol";

// contract MainAuction{
//     uint public auctionCount = 0;
//     address assetOwner;
//     uint assetId;
//     // enum State {NotStarted, Running, Ended}

//     struct Auction {
//         uint auctionId;
//         string assetName;
//         string assetDetail;
//         uint startPrice;
//         address assetOwner;

//         // bool purchased;
//         // uint256 auctionDuration;
//         // uint256 startPrice;
//         // address owner;
//         // bool active;
//         // bool finalized;
//         // State auctionState;
//       //  Bidding[] biddingList;
//     }

   

//     // Auction[] public auctions;
//     mapping(uint => Auction) public auctions;

//     event AuctionCreated(
//         uint auctionId,
//         string assetName,
//         string assetDetail,
//         uint startPrice,
//         address assetOwner
     
       
//     );


//     //Array Mapping
//         // stored all Auction data in arrray
//         // Auction[] public auctions;

//         Bidding[] public biddingList;
//         // address bidding;


//         // auctionOwned[] public auctionOwner;
        

//         // // Mapping from owner to a list of owned auctions
//         // mapping(address => uint[]) public auctionOwner;

//         // auctionOwner[]
// // auctionCount--;
//      function createAuction( string memory _assetName, string memory _assetDetail, uint _startPrice) public {
       
        
//        // auctions[auctionCount] = Auction(auctionCount, _assetName, _assetDetail, _startPrice, msg.sender);
        

//         Bidding bidding = new Bidding( auctionCount, _assetName, _assetDetail, _startPrice, msg.sender);
    
//         biddingList.push(bidding); 
       
//         auctions[auctionCount] = Auction(auctionCount, _assetName, _assetDetail, _startPrice, msg.sender);      
        
//         emit AuctionCreated(auctionCount, _assetName, _assetDetail, _startPrice, msg.sender);
//         auctionCount ++;
     
//         // auctionOwner[assetOwner] =+ assetId;
    
       
//     }

   
// }



contract MainAuction{
    uint public auctionCount = 0;
    address payable assetOwner;
    uint assetId;
    uint256 constant maxLimit = 20;
 
    // enum State {NotStarted, Running, Ended}

    struct Auction {
        uint auctionId;
        string assetName;
        string assetDetail;
        uint startPrice;
        address assetOwner;
        uint ownerDeposit;
        uint auctionDuration;
        Bidding bidding;

        // bool purchased;
        // uint256 auctionDuration;
        // uint256 startPrice;
        // address owner;
        // bool active;
        // bool finalized;
        // State auctionState;
      //  Bidding[] biddingList;
    }

   

    // Auction[] public auctions;
    mapping(uint => Auction) public auctions;

    event AuctionCreated(
        uint auctionId,
        string assetName,
        string assetDetail,
        uint startPrice,
        address assetOwner,
        uint ownerDeposit,
        uint auctionDuration, 
        Bidding indexed bidding

    );

    
    //Array Mapping
        // stored all Auction data in arrray
        // Auction[] public auctions;

        Bidding[] public _biddings;
        // address bidding;


        // auctionOwned[] public auctionOwner;
        

        // // Mapping from owner to a list of owned auctions
        // mapping(address => uint[]) public auctionOwner;

    

     function createAuction( string memory _assetName, string memory _assetDetail, uint _startPrice, uint _auctionDuration) public payable {
       
       //increment id
        auctionCount ++;  
        
       // auctions[auctionCount] = Auction(auctionCount, _assetName, _assetDetail, _startPrice, msg.sender);
        
        //require(msg.value == _startPrice, 'deposite must be same as start price');
        //create new contract
        Bidding bidding = (new Bidding){value: msg.value}(auctionCount, _assetName, _assetDetail, _startPrice, msg.sender, msg.value, (block.timestamp + (_auctionDuration*60)));
        // saving address of new contract to bidding array
        _biddings.push(bidding); 

        

        

        //stored value to auctions struct
        auctions[auctionCount] = Auction(auctionCount, _assetName, _assetDetail, _startPrice, msg.sender, msg.value, (block.timestamp + (_auctionDuration*60)), bidding );     
        // *60 because block.timestamp are on seconds 
        
        //calling auction created event 
        emit AuctionCreated(auctionCount, _assetName, _assetDetail, _startPrice, msg.sender, msg.value, (block.timestamp + (_auctionDuration*60)), bidding);
        
        
        
    }

     function biddingsCount () public view returns (uint256) {
        return _biddings.length;
    }

    function returnAllAuctions() public view returns(Bidding[] memory){
        return _biddings;
    }

    function biddings (uint256 limit, uint256 offset) public view returns (Bidding[] memory coll) {    
        require (offset <= biddingsCount(), "offset out of bounds");
        uint256 size = biddingsCount() - offset;
        size = size < limit ? size : limit;
        size = size < maxLimit ? size : maxLimit;
        coll = new Bidding[](size);

        for (uint256 i = 0; i < size; i++) {
            coll[i] = _biddings[offset + i];
        }

        return coll;    
    }
}
