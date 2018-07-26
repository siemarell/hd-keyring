import {IWallet} from "../interfaces";
import EthSimpleKeyring = require('eth-simple-keyring');


/// Wrapper around ethereumjs-wallet
export class EthWallet implements IWallet {
    public static hdCode = "60'";
    public static coin = 'ETH';

    static async fromHdPrivateKey(privateKey: Uint8Array) {
        const privateKeyHex = Buffer.from(privateKey).toString('hex')
        const _keyring = new EthSimpleKeyring([privateKeyHex]);
        await _keyring.deserialize([privateKeyHex])
        const id = (await _keyring.getAccounts())[0]
        return new EthWallet(_keyring, id)
    }

    private constructor(private _keyring: any, private id: string) {

    }

    getId() {
        return this.id
    }

    async getSecret() {
        const address = this.getId()
        return this._keyring.exportAccount(address)
    }

    // tx is an instance of the ethereumjs-transaction class.
    async signTransaction(tx: any) {
        const address = this.getId()
        return this._keyring.signTransaction(address, tx)
    }

    // For eth_sign, we need to sign transactions:
    // hd
    async signMessage(msgHash: string) {
        const address = this.getId()
        return this._keyring.signMessage(address, msgHash)
    }

    // For personal_sign, we need to prefix the message:
    async signPersonalMessage(msgHex: string) {
        const address = this.getId()
        return this._keyring.signPersonalMessage(address, msgHex)
    }

    // personal_signTypedData, signs data along with the schema
    async signTypedData(typedData: any) {
        const address = this.getId()
        return this._keyring.signTypedData(address, typedData)
    }

    // For eth_sign, we need to sign transactions:
    async newGethSignMessage(msgHex: any) {
        const address = this.getId()
        return this._keyring.newGethSignMessage(address, msgHex)
    }
}