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

const confirmPurchase = (contract, account, totalPrice) => {
	console.log(totalPrice);
	return contract.methods
		.confirmPurchase()
		.send(
			{ from: account, value: totalPrice, gas: 3500000 },
			function (err, transactionHash) {
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
			}
		);
};

const confirmDeliveryOrder = (contract, account, newDeadline) => {
    return contract.methods
		.confirmOrder(newDeadline)
		.send(
			{ from: account, gas: 3500000 },
			function (err, transactionHash) {
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
			}
		);
}

const confirmCancelOrder = (contract, account) => {
    return contract.methods
		.confirmCancelOrder()
		.send(
			{ from: account, gas: 3500000 },
			function (err, transactionHash) {
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
			}
		);
}

const confirmPaymentToSeller = (contract, account) => {
    return contract.methods
		.confirmPaymentToSeller()
		.send(
			{ from: account, gas: 3500000 },
			function (err, transactionHash) {
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
			}
		);
}

const handleWithDrawForBuyerWhenSellerNotConfirm = (contract, account) => {
    return contract.methods
		.handleWithDrawForBuyerWhenSellerNotConfirm()
		.send(
			{ from: account, gas: 3500000 },
			function (err, transactionHash) {
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
			}
		);
}

const handleWithDrawForSellerWhenDeliveryExpired = (contract, account) => {
    return contract.methods
		.handleWithDrawForSellerWhenDeliveryExpired()
		.send(
			{ from: account, gas: 3500000 },
			function (err, transactionHash) {
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
			}
		);
}

const confirmReturnOrder = (contract, account, newDeadline) => {
    return contract.methods
		.confirmReturnOrder(newDeadline)
		.send(
			{ from: account, gas: 3500000 },
			function (err, transactionHash) {
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
			}
		);
}

const confirmReturnedOrder = (contract, account) => {
    return contract.methods
		.confirmReturnedOrder()
		.send(
			{ from: account, gas: 3500000 },
			function (err, transactionHash) {
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
			}
		);
}

const handleWithDrawForBuyerWhenReturnExpired = (contract, account) => {
    return contract.methods
		.handleWithDrawForBuyerWhenReturnExpired()
		.send(
			{ from: account, gas: 3500000 },
			function (err, transactionHash) {
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
			}
		);
}

const getOrderInfo = (contract) => {
	return contract.methods.getOrderInfo().call();
};

const getAllTransactionOrder = (contract) => {
	return contract.methods.getAllTransactionOrder().call();
};
    
export {
    confirmPurchase,
    confirmPaymentToSeller,
    confirmCancelOrder,
	confirmReturnOrder,
    getOrderInfo,
	getAllTransactionOrder,
	confirmDeliveryOrder,
	confirmReturnedOrder,
	handleWithDrawForBuyerWhenSellerNotConfirm,
	handleWithDrawForSellerWhenDeliveryExpired,
	handleWithDrawForBuyerWhenReturnExpired
}
