import {EthWallet} from './EthWallet'

export const WALLETS_MAP: Record<string, IWalletInfo> = {
    'BTC': {
        hdCode: "0'"
    },
    'ETH': {
        hdCode: "60'",
        walletClass: EthWallet
    },
    'WAVES': {
        hdCode: "5741564'",
    }
}

interface IWalletInfo {
    hdCode: string,
    walletClass?: any
}