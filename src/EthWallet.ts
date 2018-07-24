import ethjswallet = require('ethereumjs-wallet')
import {IWallet} from "./interfaces";

/// Wrapper around existing wallet


export class EthWallet implements IWallet {
    static fromHdPrivateKey(privateKey: Uint8Array): IWallet {
        const _wallet = ethjswallet.fromPrivateKey(privateKey)
        return new EthWallet(_wallet)
    }

    private constructor(private _wallet: any) {

    }

    getId(): string {
        return `0x${this._wallet.getAddress().toString('hex')}`
    }

    getSecret() {
        return `0x${this._wallet.getPrivateKey().toString('hex')}`
    }


    signMessage(bytes: Uint8Array): Uint8Array {
        return undefined;
    }

    // tx is an instance of the ethereumjs-transaction class.
    signTransaction(tx: any): any {
        const privateKey = this._wallet.getPrivateKey()
        tx.sign(privateKey)
        return tx
    }


}