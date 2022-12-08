import { toast } from "react-toastify";
import Web3 from "web3";
import { BASE_PROVIDER_URL } from "../../config";

var web3 = new Web3(BASE_PROVIDER_URL);

const transactionReceiptAsync = async function (txnHash, resolve, reject) {
	try {
		var receipt = await web3.eth.getTransactionReceipt(txnHash);
		if (receipt !== null && receipt.status === true) {
			resolve(receipt);
		} else {
			setTimeout(function () {
				transactionReceiptAsync(txnHash, resolve, reject);
			}, 500);
		}
	} catch (e) {
		reject(e);
	}
};

const addOrderToWarehouse = (contract, buyer, seller, totalPrice, shippingPrice, totalProduct, dealine) => {
	console.log(contract, buyer, seller, totalPrice, shippingPrice, totalProduct, dealine);
	return contract.methods
		.addOrder(seller, totalPrice, totalProduct, shippingPrice, dealine)
		.send({ from: buyer, gas: 3500000 }, function (err, transactionHash) {
			if (!err)
				toast.promise(
					new Promise(function (resolve, reject) {
						transactionReceiptAsync(transactionHash, resolve, reject);
					}),
					{
						pending: "Transaction pending",
						success: "Transaction confirm",
						error: "Transaction rejected",
					}
				);
		});
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