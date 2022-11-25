let Warehouse = artifacts.require("Warehouse");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Warehouse);
};
