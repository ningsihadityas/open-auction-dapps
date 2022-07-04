import Web3 from 'web3';
import MainAuction from 'contracts/MainAuction.json';
import BiddingContract from 'contracts/Bidding.json';
import AuctionContract from 'contracts/AuctionContract.json';

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

// export const getBiddingListData = async () => {
//   let provider = window.ethereum;
//   let mainAuctionContract;
//   const web3 = new Web3(provider);
//   const networkId = await web3.eth.net.getId();
// };

export const getAuctionData = async () => {
  let provider = window.ethereum;
  let auctionContract; // marketContract
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId();
  let auctions = [];

  auctionContract = new web3.eth.Contract(
    AuctionContract.abi,
    AuctionContract.networks[networkId].address
  );

  let auctionCount = await auctionContract.methods.auctionCount().call();
  // Load products
  for (var i = 1; i <= auctionCount; i++) {
    const auction = await auctionContract.methods.auctions(i).call();
    //  let millis = parseFloat(auction.timestamp) * 1000;
    let startPrice = web3.utils.fromWei(auction.startPrice.toString(), 'ether');
    // let bidding2 = await mainAuctionContract.methods.biddingList(i).call();
    //  let auction_time = new Date(millis).toLocaleString();

    auctions.push({
      auctionId: auction.id,
      assetName: auction.assetName,
      assetDetail: auction.assetDetail,
      startPrice: startPrice,
      assetOwner: auction.assetOwner,
      //ownerDeposite: auction.ownerDeposite,
      auctionDuration: auction.auctionDuration,
      auctionStatus: auction.active,
    });
  }
  return auctions;
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
  // let mainAuctionContract;
  let auctionContract;
  const web3 = new Web3(provider);
  // const networkId = await web3.eth.net.getId();
  const networkId = await web3.eth.net.getId();
  let depositePrice = Web3.utils.fromWei(startPrice, 'wei');

  auctionContract = new web3.eth.Contract(
    AuctionContract.abi,
    AuctionContract.networks[networkId].address
  );
  return auctionContract.methods
    .createAuction(assetName, assetDetail, startPrice, auctionDuration)
    .send({ from: assetOwner, value: depositePrice })
    .then((auctionData) => {
      return auctionData;
    })
    .catch((err) => {
      return err.message;
    });
};

// export const biddingList = async () => {
//   let provider = window.ethereum;
//   let mainAuctionContract;
//   let biddingContract;
//   const web3 = new Web3(provider);
//   const networkId = await web3.eth.net.getId();

//   let biddingList = [];

//   mainAuctionContract = new web3.eth.Contract(
//     MainAuction.abi,
//     MainAuction.networks[networkId].address
//   );

//   biddingContract = new web3.eth.Contract(
//     BiddingContract.abi,
//     BiddingContract.networks[networkId].address
//   );

//   // return mainAuctionContract.methods
//   //   .createAuction(assetName, assetDetail, startPrice, auctionDuration)
//   //   .send({ from: assetOwner, value: depositePrice })
//   //   .then((auctionData) => {
//   //     return auctionData;
//   //   })
//   //   .catch((err) => {
//   //     return err.message;
//   //   });

//   for (var j = 0; j <= biddingList; j++) {
//     let bidding = await mainAuctionContract.methods.biddingList(j).call();

//     biddingList.push({
//       biddingId: bidding.Id,
//     });
//   }
//   return biddingList;
// };

export const bid = async (highestBidder, highestBid) => {
  let provider = window.ethereum;
  let biddingContract;
  const web3 = new Web3(provider);
  // const networkId = await web3.eth.net.getId();
  const networkId = await web3.eth.net.getId();
  // let highestBid2 = Web3.utils.fromWei(highestBid, 'wei');

  biddingContract = new web3.eth.Contract(
    BiddingContract.abi,
    BiddingContract.networks[networkId].address
  );
  return biddingContract.methods
    .bid()
    .send({ from: highestBidder, value: highestBid })
    .then((bidData) => {
      return bidData;
    })
    .catch((err) => {
      return err.message;
    });
};
