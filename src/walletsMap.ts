import {EthWallet, WavesWallet} from './wallets'
import {IWalletClass} from "./interfaces";
import {BtcWallet} from "./wallets/btc";

export const WALLETS_MAP: Record<string, IWalletInfo> = {
    'BTC': {
        hdCode: "0'",
        walletClass: BtcWallet
    },
    'ETH': {
        hdCode: "60'",
        walletClass: EthWallet
    },
    'WAVES': {
        hdCode: "5741564'",
        walletClass: WavesWallet
    }
}

interface IWalletInfo {
    hdCode: string,
    walletClass: IWalletClass
}