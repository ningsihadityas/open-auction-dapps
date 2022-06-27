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
      // bidding: auction.biddingList,
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
  let mainAuctionContract;
  const web3 = new Web3(provider);
  // const networkId = await web3.eth.net.getId();
  const networkId = await web3.eth.net.getId();
  let depositePrice = Web3.utils.fromWei(startPrice, 'wei');

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
