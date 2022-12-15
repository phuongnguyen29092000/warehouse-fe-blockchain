import { toast } from "react-toastify";
import Web3 from "web3";

const addOrderToWarehouse = (contract, buyer, seller, shippingPrice, totalProduct, deadline) => {
	return contract.methods
		.addOrder(seller, totalProduct, shippingPrice, deadline)
		.send({ from: buyer, gas: 3500000 });
};

const getAllOrder = (contract) => {
    return contract.methods.getAllOrder().call()
}

const getOrderPerCompany = (contract, addressCompany) => {
    return contract.methods.getOrderPerCompany(addressCompany).call()
}

const getOwner = (contract) => {
	return contract.methods.getOwner().call();
};

export {
    getAllOrder,
    getOrderPerCompany,
    getOwner,
    addOrderToWarehouse
}