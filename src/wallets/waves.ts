import * as SG from '@waves/waves-signature-generator'
import {IWallet} from "../interfaces";


export class WavesWallet implements IWallet {
    static fromHdPrivateKey(privateKey: Uint8Array): IWallet {
        const convertedKey = this._convertKey(privateKey)
        return new WavesWallet(convertedKey)
    }

    private constructor(private privateKey: any) {
        this.publicKey = this.privateKey
    }


    getId(): string {
        return this.publicKey;
    }

    getSecret(): string {
        return this.privateKey;
    }

    signMessage(bytes: Uint8Array): Uint8Array {
        return undefined;
    }

    signTransaction(tx: any): any {
    }

    async serialize() {
        const result = Object.keys(this.accounts).map(key => this.accounts[key].phrase)
        return result
    }

    async deserialize(seeds = []) {
        this.accounts = seeds.map(seed => SG.Seed.fromExistingPhrase(seed))
            .reduce((prev, next) => {
                prev[next.keyPair.publicKey] = next
                return prev
            }, {})
    }

    async getAccounts() {
        return Object.keys(this.accounts).map(pk => Account(pk, "WAVES"))
    }

    async signTransaction(withAccount, txData) {
        const wallet = this._getWalletForAccount(withAccount)

        const transfer = await this.Waves.tools.createTransaction(txData.type, txData)
        transfer.addProof(wallet.keyPair.privateKey)
        return await transfer.getJSON()
    }

    async signMessage(withAccount, bytes) {
        const wallet = this._getWalletForAccount(withAccount)
        const signature = this.Waves.crypto.buildTransactionSignature(bytes, wallet.keyPair.privateKey)
        return signature
    }

    // exportAccount should return a hex-encoded private key:
    exportAccount(pk) {
        const wallet = this._getWalletForAccount(pk)
        return Promise.resolve(wallet.phrase)
    }

    _getWalletForAccount(pk) {
        let wallet = this.accounts[pk]
        if (!wallet) throw new Error(`Waves Simple Keyring - Unable to find matching public key ${pk}`)
        return wallet
    }
}