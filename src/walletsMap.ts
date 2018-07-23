import EthWallet = require('ethereumjs-wallet')

EthWallet.fromHdPrivateKey = EthWallet.fromPrivateKey
EthWallet.prototype.getId = function(){return `0x${this.getAddress().toString('hex')}`}
EthWallet.prototype.getSecret = function(){return `0x${this.getPrivateKey().toString('hex')}`}

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