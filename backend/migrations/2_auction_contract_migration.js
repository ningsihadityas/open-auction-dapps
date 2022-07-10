const MainAuction = artifacts.require('MainAuction');

// module.exports = function (deployer) {
//   let auctionId = 0;
//   let assetName = 'tyas';
//   let assetDetail = '';
//   let startPrice = 0;
//   let assetOwner = '0x0000000000000000000000000000000000000000';
//   // let assetOwner = '';
//   let ownerDeposite = 0;
//   let auctionDuration = 0;

//   deployer.deploy(MainAuction).then(function () {
//     return deployer.deploy(
//       Bidding,
//       auctionId,
//       assetName,
//       assetDetail,
//       startPrice,
//       assetOwner,
//       ownerDeposite,
//       auctionDuration
//     );
//   });
// };

module.exports = function (deployer) {
  deployer.deploy(MainAuction);
};
