import {IKeyring} from './IKeyring'
import HDNode = require("hdkey")
import * as bip39 from 'bip39'
import {WALLETS_MAP} from './walletsMap'
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
        const newWallets = range(oldLen, oldLen + n)
            .map(i=> {
                const hdNode = coinRoot.deriveChild(i)
                return WalletInfo.walletClass.fromHdPrivateKey(hdNode.privateKey)
            })
        this.wallets[type] = this.wallets[type].concat(newWallets)
        return newWallets.map(wallet => wallet.getId())
    }

    async exportAccount(accountId: string) {
        const wallet = this._getWalletForAccount(accountId)
        return wallet.getSecret();
    }

    async getAccounts() {
        return this._getFlatWallets().map(wallet => wallet.getId());
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

    private _getWalletForAccount(accountId: string){
        return this._getFlatWallets().find(wallet => wallet.getId()===accountId)
    }

    private _getFlatWallets(){
        return Object.keys(this.wallets).reduce((prev, next)=> prev.concat(this.wallets[next]),[]);
    }
}

interface ISerialized {
    mnemonic?: string
}