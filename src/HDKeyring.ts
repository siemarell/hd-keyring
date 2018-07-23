import {IKeyring} from './IKeyring'
import HDNode = require("hdkey")
import * as bip39 from 'bip39'
import {WALLETS_MAP} from './codes'
import {range} from './util'

//const hdPathString = `m/44'/60'/0'/0`
const hdPathString = `m/44'`

export class HDKeyring implements IKeyring {
    //static type = 'HD Key Tree'
    private mnemonic: string = ''
    private hdWallet: HDNode
    private readonly hdPath: string
    private roots: Record<string, HDNode> = {}
    private wallets: Record<string, any[]> = {}

    constructor(serialized: ISerialized = {}) {
        this.wallets = Object.keys(WALLETS_MAP).reduce((prev,next)=> {prev[next] = [];return prev},this.wallets)
        this.hdPath = hdPathString
        this.deserialize(serialized)
    }

    async deserialize(serialized: ISerialized) {
        this._initFromMnemonic(serialized.mnemonic)
    }

    async serialize() {
        return {
            mnemonic: this.mnemonic,
        };
    }

    async addAccounts(n = 1, type = 'ETH') {
        const WalletInfo = WALLETS_MAP[type]

        if (!WalletInfo) throw new Error(`Unsupported coin type: ${type}`)


        if (!this.hdWallet) {
            this._initFromMnemonic(bip39.generateMnemonic())
        }

        let coinRoot = this.roots[type]
        if (!coinRoot){
            const hdPath = `${this.hdPath}/${WalletInfo.hdCode}/0'/0`
            coinRoot = this.hdWallet.derive(hdPath)
            this.roots[type] = coinRoot
        }

        const oldLen = this.wallets[type].length
        const keys = range(oldLen, oldLen + n).map(i=> coinRoot.deriveChild(i))

        return keys.map(key=> WalletInfo.walletClass.fromPrivateKey(key.privateKey))
    }

    async exportAccount(accountId: string) {
        return '';
    }

    async getAccounts() {
        return [''];
    }

    async signMessage(accountId: string, bytes: Uint8Array): Promise<any> {
        return undefined;
    }

    async signTransaction(accountId: string, txData: any): Promise<any> {
        return undefined;
    }

    private _initFromMnemonic(mnemonic: string) {
        this.mnemonic = mnemonic
        const seed = bip39.mnemonicToSeed(mnemonic)
        this.hdWallet = HDNode.fromMasterSeed(seed)
    }

}

interface ISerialized {
    mnemonic?: string
}

0x12c85a345326e9f6083d2db8012b6b41c13f2b83