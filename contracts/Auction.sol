
// SPDX-License-Identifier
pragma solidity ^0.5.0;

contract Auction {

    //Item Array
	struct Item{			
		string item_name; // name
		string item_desc; // description
		uint base_price; // start price
		uint auction_price;  // current price of item
        uint auctionDuration;
        string shippingDetail;
	}
	

    // global variabel to count the auction
	uint constant itemCount = 4;
    uint[itemCount] public arrayForItems;
	uint public itemId = 0;

    // mapping pending return so the bidder can withdraw their eth
	mapping(address => mapping(uint=>uint)) private pendingReturns;

	// auction item mapping
    mapping(uint => Item) public items; 

	// highest bidder mapping
	mapping(uint => address) public highestBidders; 

    

	// to trigger bid function everytime user place a bid
	event BidEvent(uint _itemId, uint indexed _bidAmt);


	// (price convert from wei to ether) 1 ether = 1.000.000.000.000.000.000 wei 
	constructor() public {	
		addItem("The Alchemist Book", "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.", 1000000000000000000, 1000000000000000000,60, "");
		addItem("Nike Shoes Air Jordan 1 : Prototype Game-worn", "This AJ1 shoe is an early prototype from Nike for Michael Jordan to wear during basketball games. The term is 'The Mother of The Jordan Shoes'.", 2000000000000000000,  2000000000000000000,3, "");
		addItem("The Comfort Book by Matt Haig", "The new uplifting book from Matt Haig, the New York Times bestselling author of The Midnight Library, for anyone in search of hope, looking for a path to a more meaningful life, or in need of a little encouragement.", 3000000000000000000,  3000000000000000000,5, "");
		addItem("Air Jordan 1 : Shattered Backboard", "shoes worn by Michael Jordan in a friendly match hosted by Nike. These shoes were used in a moment that was both shocking and amazing when MJ did a slam dunk hard enough to break the backboard ring. These shoes become memories for unforgettable moments for every basketball fan who witnessed at the time.", 5000000000000000000,  5000000000000000000, 10, "");
	}
	
	//startPrice = current auctionPrice
    // (itemCount starts at 0)
	function addItem (string memory _name, string memory _desc, uint _baseValue,  uint _auctionPrice, uint _auctionDuration, string memory _shippingDetail) private { 	
		items[itemId] = Item(_name, _desc, _baseValue, _auctionPrice, (block.timestamp + (_auctionDuration*60)), _shippingDetail);
		highestBidders[itemId] = address(0);
		itemId ++;
	}


	// Function to get item count
	function getItemCount () public pure returns (uint) {
		return itemCount;
	}
	

	// Function to get the name 
	function getItemName (uint _itemId) public view returns (string memory) {
		require(_itemId >= 0 && _itemId < itemCount, "Item does not exist"); // the item id must be greater than 0 but less or equal to the total count

		return items[_itemId].item_name;
	}

    	// Function to get auction duration 
	function getAuctionDuration (uint _itemId) public view returns (uint) {
		require(_itemId >= 0 && _itemId < itemCount, "Item does not exist"); // the item id must be greater than 0 but less or equal to the total count

		return items[_itemId].auctionDuration;
	}


	// Function to get the highest current bid
	function getItemPrice (uint _itemId) public view returns (uint) {
		require(_itemId >= 0 && _itemId < itemCount, "Item does not exist"); // the item id must be greater than 0 but less or equal to the total count

		return items[_itemId].auction_price;
	}


	// Function to get percent increase in value over original listing price
	function getPercentIncrease (uint _itemId) public view returns (uint) {
		uint auctionPrice = items[_itemId].auction_price;
		uint basePrice = items[_itemId].base_price;
		uint percentIncrease = (auctionPrice - basePrice)*100/basePrice;

		return percentIncrease;
	}
	

	// Function to get numerical information for all items in the auction as an array
	function getArrayOfNumericalInformation (uint num) public view returns (uint[itemCount] memory) {
		uint[itemCount] memory arrayOfNumbers;

		for (uint i=0;i < itemCount; i++) {
			if (num == 1) {
				arrayOfNumbers[i] = this.getItemPrice(i);
			} else if (num == 2) {
				arrayOfNumbers[i] = this.getPercentIncrease(i);
			} 
		}

		return arrayOfNumbers;
	}
	


	// Function to get array of prices of all items in auction as an array
	function getArrayOfPrices () public view returns (uint[itemCount] memory) {
		return this.getArrayOfNumericalInformation(1);
	}


	// Function to get array of increase in percentages of all items in auction as an array
	function getArrayOfIncreases () public view returns (uint[itemCount] memory) {
		return this.getArrayOfNumericalInformation(2);
	}


	// Function to get array of increments of all items in auction as an array
	function getArrayOfIncrements () public view returns (uint[itemCount] memory) {
		return this.getArrayOfNumericalInformation(3);
	}

	// function to get pending returns
	function getPendingReturns(address _bidder,uint _itemId) external view returns(uint){
        return pendingReturns[_bidder][_itemId];
    }

	//function get highest bidder (not in array)
	function getHighestBidder(uint _itemId) public view returns(address) {
      return highestBidders[_itemId];
	}

	// Function to get the array of highest bidders
	function getHighestBidders () public view returns (address[itemCount] memory) {
		address[itemCount] memory arrayOfBidders;

		for (uint i=0;i < itemCount; i++) {
			arrayOfBidders[i] = highestBidders[i];
		}

		return arrayOfBidders;

	}
	
	
    // Function to place a bid
    function placeBid (uint _itemId) public payable returns (uint) {

        uint _bidAmt = msg.value;
        // Requirements 
		require(_itemId >= 0 && _itemId < itemCount, "Bidding on an invalid item"); 
		
		require(block.timestamp < getAuctionDuration(_itemId), "the auction had ended");

        require(check_bid (_itemId, _bidAmt),"Bid is lower or equal to the highest bid value"); 
		
		require(check_highest_bidder(_itemId, msg.sender), "Person bidding is the highest bidder");

        items[_itemId].auction_price = _bidAmt; 
		highestBidders[_itemId] = msg.sender; 

         //funds mapping so the user can get his money back when he lost
        if (_bidAmt != 0){
           pendingReturns[msg.sender][_itemId] += _bidAmt;
        }

        emit BidEvent(_itemId, _bidAmt); 

        return _itemId; // return the item back 	

    }


    // Function to check if the bid is greater than highest bid
	function check_bid (uint _itemId, uint _bidAmt) public view returns (bool) {
		if (_bidAmt > items[_itemId].auction_price) return true;
		else return false;
	}

	

	// Function to check if person bidding is the highest bidder
	function check_highest_bidder (uint _itemId, address person_wallet) public view returns (bool) {
		if (person_wallet == highestBidders[_itemId]) {
			return false;
		} else {
			return true;
		}
	}

	// function to withdraw eth
    function withdraw(uint _itemId) public payable returns(bool){
       	uint amount = pendingReturns[msg.sender][_itemId];
        address winner = highestBidders[_itemId];
		

        if(msg.sender == winner){
            pendingReturns[msg.sender][_itemId] = 0;
            revert("you are the winner of this auction");
        }
        
        // make the pending returns to 0 everytime user click withdraw (avoid DAO)
        if(amount > 0){
            pendingReturns[msg.sender][_itemId] = 0;
         
            //if fail to sending money back
            if(!(msg.sender).send(amount)){
                pendingReturns[msg.sender][_itemId] = amount; //the money will back to the amount container
                return false;
            }
        }
        return true;
    }

     // stored shipping detail
    function submitShippingDetail(uint _itemId, string memory _shippingDetail) public returns(bool) {

		uint winnerAmount = items[_itemId].auction_price;

		// init address juru lelang
		address payable auctioneerAddress = 0xF528bb55c1c0BE10c23D5b311F6cd652116B10F8;
		
		require(block.timestamp >= getAuctionDuration(_itemId), "the auction not ended yet");

		if (msg.sender == getHighestBidder(_itemId)){
              // shippingDetail = _shippingDetail;
        	items[_itemId].shippingDetail = _shippingDetail;

			if(winnerAmount > 0){
            	items[_itemId].auction_price = 0;
         		
            	//if fail to sending money back
            	if(!(auctioneerAddress).send(winnerAmount)){
                	items[_itemId].auction_price = winnerAmount; //the money will back to the amount container
           	 	}
				return false;

		 	}
			return true;
        }
		else{
			revert("you are not the winner of this auction");
		}

    }

    // return value of shipping detail
    function getShippingDetail(uint _itemId) public view returns (string memory){

        return items[_itemId].shippingDetail;
    }


}