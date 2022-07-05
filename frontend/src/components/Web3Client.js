import Web3 from 'web3';
import MainAuction from 'contracts/MainAuction.json';
import BiddingContract from 'contracts/Bidding.json';

let selectedAccount;

export const init = async () => {
  let provider = window.ethereum;

  if (typeof provider !== 'undefined') {
    provider.on('accountsChanged', () => window.location.reload());
    return provider
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        selectedAccount = accounts[0];
        return selectedAccount;
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    console.log(
      'Non-Ethereum browser detected. You should consider trying MetaMask!'
    );
  }
};

export const getAuctionData = async () => {
  let provider = window.ethereum;
  let mainAuctionContract; // marketContract
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId();
  let auctions = [];

  mainAuctionContract = new web3.eth.Contract(
    MainAuction.abi,
    MainAuction.networks[networkId].address
  );

  let auctionCount = await mainAuctionContract.methods.auctionCount().call();
  // Load products
  for (var i = 1; i <= auctionCount; i++) {
    const auction = await mainAuctionContract.methods.auctions(i).call();
    //  let millis = parseFloat(auction.timestamp) * 1000;
    let startPrice = web3.utils.fromWei(auction.startPrice.toString(), 'ether');
    //  let auction_time = new Date(millis).toLocaleString();

    auctions.push({
      auctionId: auction.auctionId,
      assetName: auction.assetName,
      assetDetail: auction.assetDetail,
      startPrice: startPrice,
      assetOwner: auction.assetOwner,
      //ownerDeposite: auction.ownerDeposite,
      auctionDuration: auction.auctionDuration,
      bidding: auction.bidding,
    });
  }
  return auctions;
  // return mainAuctionContract.methods.auctions(1);
};

export const getBidData = async () => {
  let provider = window.ethereum;
  let biddingContract; // marketContract
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId();
  let bids = [];

  biddingContract = new web3.eth.Contract(
    BiddingContract.abi,
    BiddingContract.networks[networkId].address
  );

  let bidCount = await biddingContract.methods.myBidsCount().call();
  // Load products
  for (var i = 1; i <= bidCount; i++) {
    const bid = await biddingContract.methods.bids(i).call();
    //  let millis = parseFloat(auction.timestamp) * 1000;
    //let startPrice = web3.utils.fromWei(auction.startPrice.toString(), 'ether');
    //  let auction_time = new Date(millis).toLocaleString();

    bids.push({
      amount: bid.value,
      bidder: bid.bidder,
    });
  }
  return bids;
  // return mainAuctionContract.methods.auctions(1);
};

export const createAuction = async (
  assetName,
  assetDetail,
  startPrice,
  assetOwner,
  // ownerDeposite,
  auctionDuration
) => {
  let provider = window.ethereum;
  let mainAuctionContract;
  const web3 = new Web3(provider);
  // const networkId = await web3.eth.net.getId();
  const networkId = await web3.eth.net.getId();
  let depositePrice = Web3.utils.toWei(startPrice, 'ether');

  mainAuctionContract = new web3.eth.Contract(
    MainAuction.abi,
    MainAuction.networks[networkId].address
  );
  return mainAuctionContract.methods
    .createAuction(assetName, assetDetail, startPrice, auctionDuration)
    .send({ from: assetOwner, value: depositePrice })
    .then((auctionData) => {
      return auctionData;
    })
    .catch((err) => {
      return err.message;
    });
};

export const placeBid = async () => {
  let provider = window.ethereum;
  let biddingContract;
  const web3 = new Web3(provider);
  // const networkId = await web3.eth.net.getId();
  const networkId = await web3.eth.net.getId();

  biddingContract = new web3.eth.Contract(
    BiddingContract.abi,
    BiddingContract.networks[networkId].address
  );

  let mainAuctionContract;
  mainAuctionContract = new web3.eth.Contract(
    MainAuction.abi,
    MainAuction.networks[networkId].address
  );

  const bidding = await mainAuctionContract.methods.bidding().call(1);
  const highestBid = await biddingContract.methods.highestBid().call();
  let amount2 = Web3.utils.toWei(highestBid, 'wei');
  const bidder = await biddingContract.methods.highestBidder().call();
  // const startPrice = await biddingContract.methods.startPrice().call();
  //const auctionDuration = await biddingContract.methods
  // .auctionDuration()
  // .call();
  //const assetName = await biddingContract.methods.assetName().call();
  //const assetDetail = await biddingContract.methods.assetDetail().call();
  //const assetOwner = await biddingContract.methods.assetOwner().call();

  return biddingContract.methods
    .placeBid()
    .send({ from: bidder, value: amount2, to: bidding[1] })
    .then((bidData) => {
      return bidData;
    })
    .catch((err) => {
      return err.message;
    });
};
