import Warehouse from "../contracts/Warehouse.json";
import Order from "../contracts/Order.json";
import { NETWORK_ID } from "../config";

export const getContract = (library, address, type) => {
	switch (type) {
		case "Order":
			return new library.eth.Contract(Order.abi, address);
		default:
			return new library.eth.Contract(Warehouse.abi, address);
	}
};

export const getWarehouseAdress = () => {
	return Warehouse.networks[NETWORK_ID].address;
};
