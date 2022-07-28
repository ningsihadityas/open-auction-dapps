App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: async function () {
    // Load auction.
    $.getJSON('../aucD.json', function (data) {
      var auctionRow = $('#auctionRow');
      var auctionTemplate = $('#auctionTemplate');

      for (i = 0; i < data.length; i++) {
        // Adding data from json
        auctionTemplate.find('.panel-title').text(`Auction ${i + 1}`);
        auctionTemplate.find('.auction-name').text(data[i].name);
        auctionTemplate.find('.auction-description').text(data[i].description);
        auctionTemplate
          .find('.base-price')
          .text(`Started at ${data[i].original_price} ETH`); // base price

        auctionTemplate
          .find('.auction-duration')
          .text(`${data[i].auctionDuration}`);

        // Creating identifier attributes for HTML elements
        auctionTemplate.find('.shipping-detail').attr('data-id', data[i].id);
        auctionTemplate.find('.highest-bid').attr('data-id', data[i].id);

        // adding attribute to associate itemids to submit buttons
        auctionTemplate.find('.btn-submit').attr('data-id', data[i].id);
        auctionTemplate.find('.btn-withdraw').attr('data-id', data[i].id);
        auctionTemplate
          .find('.btn-shipping-detail')
          .attr('data-id', data[i].id);

        //form field
        auctionTemplate
          .find('.input-amount')
          .attr('id', `input-amt-${data[i].id}`);
        auctionTemplate
          .find('.input-shipping-detail')
          .attr('id', `input-shp-${data[i].id}`);

        auctionRow.append(auctionTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  // Function to intialize web3
  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        window.ethereum.autoRefreshOnNetworkChange = false;
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        // User denied account access...
        console.error('User denied account access');
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      );
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  // Function to initialize contract
  initContract: function () {
    $.getJSON('Auction.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AuctionArtifact = data;
      App.contracts.Auction = TruffleContract(AuctionArtifact);

      // Set the provider for the contract
      App.contracts.Auction.setProvider(App.web3Provider);

      // Set up the accounts
      web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          App.account = account;
          $('#account').text(account);
        }
      });

      return App.updateAuctionPrices();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-submit', App.handleBid);
    $(document).on('click', '.btn-withdraw', App.handleWithdraw);
    $(document).on('click', '.btn-shipping-detail', App.handleShippingDetail);
  },

  //boolean changes in bid button
  handleInputChanges: function (id, bidAmount2) {
    var account = App.account;
    var aucId = id.split('-')[2];

    console.log(id);
    var highestBidder = $(document).find('.highest-bidder').eq(aucId).text();

    var highestBid2 = Number(
      $(document).find(`.highest-bid[data-id=${aucId}]`).text()
    );

    var highestBid = web3.fromWei(highestBid2, 'ether');
    var bidAmount = web3.fromWei(bidAmount2, 'ether');

    console.log('hb' + highestBid);
    console.log('ba' + bidAmount);

    if (account !== highestBidder) {
      if (bidAmount > highestBid) {
        $(document)
          .find(`.btn-submit[data-id=${aucId}]`)
          .prop('disabled', false);
      } else {
        $(document)
          .find(`.btn-submit[data-id=${aucId}]`)
          .prop('disabled', true);
      }
    } else {
      $(document).find(`.btn-submit[data-id=${aucId}]`).prop('disabled', true);
    }
  },

  updateAuctionIncreases: function () {
    var auctionInstance;

    App.contracts.Auction.deployed()
      .then(function (instance) {
        auctionInstance = instance;

        return auctionInstance.getArrayOfIncreases.call();
      })
      .then(function (increases) {
        for (j = 0; j < increases.length; j++) {
          $(document).find('.incr-in-value').eq(j).text(`${increases[j]}%`);
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  updateAuctionPrices: function () {
    var auctionInstance;

    App.contracts.Auction.deployed()
      .then(function (instance) {
        auctionInstance = instance;

        return auctionInstance.getArrayOfPrices.call();
      })
      .then(function (result) {
        for (j = 0; j < result.length; j++) {
          $(document)
            .find('.highest-bid')
            .eq(j)
            .text(`${web3.fromWei(result[j], 'ether')}`);
          // web3.fromWei(result[j], 'ether');
        }
      })
      .then(function (result) {
        return App.updateAuctionIncreases();
      })
      .then(function (result) {
        return App.updateHighestBidders();
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  updateHighestBidders: function () {
    var auctionInstance;

    App.contracts.Auction.deployed()
      .then(function (instance) {
        auctionInstance = instance;

        return auctionInstance.getHighestBidders.call();
      })
      .then(function (bidders) {
        for (j = 0; j < bidders.length; j++) {
          $(document).find('.highest-bidder').eq(j).text(`${bidders[j]}`);
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  handleBid: function (event) {
    event.preventDefault();

    var aucId = parseInt($(event.target).data('id'));
    var bid_amount = parseInt($(`#input-amt-${aucId}`).val());

    var bid = web3.toWei(bid_amount, 'ether');
    console.log(bid);

    var auctionInstance;
    var account = App.account;

    App.contracts.Auction.deployed()
      .then(function (instance) {
        auctionInstance = instance;

        // Execute place bid as a transaction by sending account
        return auctionInstance.placeBid(aucId, {
          value: bid,
          from: account,
        });
      })
      .then(function (result) {
        return App.updateAuctionPrices();
      })
      .then(function () {
        $(`#input-amt-${aucId}`).val('');
        swal(
          'Congrats!',
          'Your bid has been submitted: ' + bid_amount + ' ETH',
          'success'
        );
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  handleWithdraw: function (event) {
    event.preventDefault();

    var aucId = parseInt($(event.target).data('id'));
    console.log('aucId' + aucId);

    var auctionInstance;
    var account = App.account;

    var highestBidder = $(document).find('.highest-bidder').eq(aucId).text();

    if (account !== highestBidder) {
      App.contracts.Auction.deployed()
        .then(function (instance) {
          auctionInstance = instance;

          return auctionInstance.withdraw(aucId, {
            from: account,
          });
        })
        .then(function () {
          swal('', 'Your ETH Has Been Withdrawn', 'success');
        })
        .catch(function (err) {
          console.log(err.message);
        });
    } else {
      swal(' ', 'You Are The Highest Bidder', 'error');
    }
  },

  handleShippingDetail: function (event) {
    event.preventDefault();

    var aucId = parseInt($(event.target).data('id'));
    var shp = $(`#input-shp-${aucId}`).val();
    var highestBidder = $(document).find('.highest-bidder').eq(aucId).text();

    var auctionInstance;
    var account = App.account;

    if (account == highestBidder) {
      App.contracts.Auction.deployed()
        .then(function (instance) {
          auctionInstance = instance;

          let highestBidder = auctionInstance.getHighestBidder.call(aucId);
          console.log(highestBidder);

          let aucD = auctionInstance.getAuctionDuration.call(aucId);
          console.log(aucD);

          // Execute place bid as a transaction by sending account
          return auctionInstance.submitShippingDetail(aucId, shp, {
            from: account,
          });
        })
        .then(function () {
          swal(
            '',
            'Your Shipping Detail Has Been Submitted:  ' + shp,
            'success'
          );
          //get shipping detail data from sc
          let aucK = auctionInstance.getShippingDetail.call(aucId);
          console.log(aucK);

          console.log(shp);
          //disable button
          $(`#input-shp-${aucId}`).val('');
          $(document)
            .find(`.btn-shipping-detail[data-id=${aucId}]`)
            .prop('disable', true);

          //update shipping detail
          $(document).find('.shipping-detail').eq(aucId).text(`${shp}`);
          // web3.fromWei(result[j], 'ether');
        })
        .catch(function (err) {
          console.log(err.message);
        });
    } else {
      swal(
        'You Are Not The Winner',
        'Only Winner can submit the shipping detial information ',
        'warning'
      );

      $(`#input-shp-${aucId}`).val('');
    }
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
