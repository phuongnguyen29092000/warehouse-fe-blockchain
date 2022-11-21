let PurchaseAgreement = artifacts.require("PurchaseAgreement");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(PurchaseAgreement);
};
