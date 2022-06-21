const Migrations = artifacts.require('Migrations');
const MainAuction = artifacts.require('MainAuction');
const Bidding = artifacts.require('Bidding');

module.exports = function (deployer) {
  let auctionId;
  let assetName;
  let assetDetail;
  let startPrice;
  let assetOwner;
  let ownerDeposite;
  let auctionDuration;

  deployer.deploy(MainAuction);
  //deployer.deploy(Bidding);
  // deployer.deploy(
  //   Bidding,
  //   auctionId,
  //   assetName,
  //   assetDetail,
  //   startPrice,
  //   assetOwner,
  //   ownerDeposite,
  //   auctionDuration
  // );
};
