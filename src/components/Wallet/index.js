import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

export const injected = new InjectedConnector({
	supportedChainIds: [1, 3, 4, 5, 42, 1337],
});