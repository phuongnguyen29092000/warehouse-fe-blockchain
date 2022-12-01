import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { injected } from "../components/Wallet";
import Web3 from "web3";
import { BASE_PROVIDER_URL } from "../config";

export function useEagerConnect() {
	const { activate, active } = useWeb3React();

	const [tried, setTried] = useState(false);

	useEffect(() => {
		injected.isAuthorized().then((isAuthorized) => {
			if (isAuthorized) {
				activate(injected, undefined, true).catch(() => {
					setTried(true);
				});
			} else {
				setTried(true);
			}
		});
	}, []);

	useEffect(() => {
		if (!tried && active) {
			setTried(true);
		}
	}, [tried, active]);

	return tried;
}

export function useLibrary() {
	const { active, library } = useWeb3React();
	if (active) {
		return library;
	}
	const provider = BASE_PROVIDER_URL;
	return new Web3(provider);
}
