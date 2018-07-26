import ethjswallet = require('ethereumjs-wallet')
import ethUtil = require('ethereumjs-util')
import sigUtil = require('eth-sig-util')
import {IWallet} from "../interfaces";

/// Wrapper around ethereumjs-wallet
export class EthWallet implements IWallet {
    public static hdCode = "60'";
    public static coin = 'ETH';

    static fromHdPrivateKey(privateKey: Uint8Array): EthWallet {
        const _wallet = ethjswallet.fromPrivateKey(privateKey);
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

    // tx is an instance of the ethereumjs-transaction class.
    signTransaction(tx: any): any {
        const privateKey = this._wallet.getPrivateKey();
        tx.sign(privateKey);
        return tx
    }

    // For eth_sign, we need to sign transactions:
    // hd
    signMessage(msgHash: string): string {
        const privateKey = this._wallet.getPrivateKey();
        const message = ethUtil.stripHexPrefix(msgHash)
        const msgSig = ethUtil.ecsign(Buffer.from(message, 'hex'), privateKey);
        return ethUtil.bufferToHex(sigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s));
    }

    // For personal_sign, we need to prefix the message:
    signPersonalMessage(msgHex: string) {
        const privateKey = this._wallet.getPrivateKey();
        return sigUtil.personalSign(privateKey, {data: msgHex})
    }

    // personal_signTypedData, signs data along with the schema
    signTypedData(typedData: any) {
        const privateKey = this._wallet.getPrivateKey();
        /// ToDo: use non legacy method
        return sigUtil.signTypedDataLegacy(privateKey, {data: typedData})
    }
}