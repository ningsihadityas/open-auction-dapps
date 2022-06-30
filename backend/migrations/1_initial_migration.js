const Migrations = artifacts.require('Migrations');
const MainAuction = artifacts.require('MainAuction');
const Bidding = artifacts.require('Bidding');

module.exports = function (deployer) {
  let auctionId = 0;
  let assetName = '';
  let assetDetail = '';
  let startPrice = 0;
  let assetOwner = '0x0000000000000000000000000000000000000000';
  let ownerDeposite = 0;
  let auctionDuration = 0;

  deployer.deploy(MainAuction).then(function () {
    return deployer.deploy(
      Bidding,
      auctionId,
      assetName,
      assetDetail,
      startPrice,
      assetOwner,
      ownerDeposite,
      auctionDuration
    );
  });
};
