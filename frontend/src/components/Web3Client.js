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
  assetOwner,
  startPrice,
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

  //var depositPrice = document.getElementById('deposit_value').value;
  //depositPrice = web3.toWei(depositPrice, 'ether');

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

// export const bidOnAuction = async (auctionId, bidder, amount) => {
//   let provider = window.ethereum;
//   let auctionContract;
//   const web3 = new Web3(provider);
//   // const networkId = await web3.eth.net.getId();
//   const networkId = await web3.eth.net.getId();
//   let amount2 = Web3.utils.fromWei(amount, 'wei');

//   auctionContract = new web3.eth.Contract(
//     AuctionContract.abi,
//     AuctionContract.networks[networkId].address
//   );
//   return AuctionContract.methods
//     .bidOnAuction(auctionId)
//     .send({ from: bidder, value: amount2 })
//     .then((bidData) => {
//       return bidData;
//     })
//     .catch((err) => {
//       return err.message;
//     });
// };

export const bidOnAuction = async (auctionId) => {
  var auctions = [];
  let auctionContract;
  let provider = window.ethereum;
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId();

  auctionContract = new web3.eth.Contract(
    AuctionContract.abi,
    AuctionContract.networks[networkId].address
  );

  const bidAmount = await auctionContract.methods.ethAmountSent.call().call();
  const bidder = await auctionContract.methods.newBid.bidder().call();

  let bid = Web3.utils.fromWei(bidAmount, 'wei');
  // if (bid < auction['tempAmount']) {
  //   console.log('Bid has to be at least ' + auction['tempAmount'], 'error');
  //   return;
  // }

  return auctionContract.methods
    .bidOnAuction(auctions[auctionId])
    .send({ from: bidder, value: bid })
    .then((bidData) => {
      return bidData;
    })
    .catch((err) => {
      return err.message;
    });

  // .then(function (txnId) {
  //   console.log('Bid txnId: ' + txnId);
  //   web3.eth.getTransactionReceipt(txnId, function (err, txnReceipt) {
  //     if (txnReceipt.gasUsed == gas) {
  //       console.log('We had a failed bid ' + txnReceipt);
  //       setStatus('Bid failed', 'error');
  //       hideSpinner();
  //     } else {
  //       console.log('We had a successful bid ' + txnReceipt);
  //       setStatus('Bid succeeded!', 'success');
  //       hideSpinner();
  //     }
  //   });
  //   refreshAuction();
  // });
};
