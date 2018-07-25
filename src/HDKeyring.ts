import {IKeyring, IWallet} from './interfaces'
import HDNode = require("hdkey")
import * as bip39 from 'bip39'
import {WALLETS_MAP} from './walletsMap'
import {range} from './util'


//const hdPathString = `m/44'/60'/0'/0`
const hdPathString = `m/44'`
const type = 'HD Key Tree'

export class HDKeyring implements IKeyring {
    public static type = type
    public type = type

    private mnemonic: string = ''
    private hdWallet: HDNode
    private readonly hdPath: string
    private roots: Record<string, HDNode> = {}
    private wallets: Record<string, IWallet[]> = {}

    constructor(serialized: ISerialized = {}) {
        this.wallets = Object.keys(WALLETS_MAP).reduce((prev, next) => {
            prev[next] = [];
            return prev
        }, this.wallets)
        this.hdPath = hdPathString
        this.deserialize(serialized)
    }

    async deserialize(serialized: ISerialized) {
        if (serialized.mnemonic) this._initFromMnemonic(serialized.mnemonic)
        if (serialized.accountNumbers) {
            Object.entries(serialized.accountNumbers).forEach(async ([type, n]) => {
                await this.addAccounts(n, type)
            })
        }
    }

    async serialize() {
        const accountNumbers = Object.entries(this.wallets).reduce((prev, [chain, wallets]) => {
            prev[chain] = wallets.length
            return prev
        }, {} as any)

        return {
            mnemonic: this.mnemonic,
            accountNumbers
        }
    }

    async addAccounts(n = 1, type = 'ETH') {
        const WalletInfo = WALLETS_MAP[type]

        if (!WalletInfo) throw new Error(`Unsupported coin type: ${type}`)


        if (!this.hdWallet) {
            this._initFromMnemonic(bip39.generateMnemonic())
        }

        let coinRoot = this.roots[type]
        if (!coinRoot) {
            const hdPath = `${this.hdPath}/${WalletInfo.hdCode}/0'/0`
            coinRoot = this.hdWallet.derive(hdPath)
            this.roots[type] = coinRoot
        }

        const oldLen = this.wallets[type].length
        const newWallets = range(oldLen, oldLen + n)
            .map(i => {
                const hdNode = coinRoot.deriveChild(i)
                return WalletInfo.walletClass.fromHdPrivateKey(hdNode.privateKey)
            })
        this.wallets[type] = this.wallets[type].concat(newWallets)
        return newWallets.map(wallet => wallet.getId())
    }

    async getAccounts() {
        return this._getFlatWallets().map(wallet => wallet.getId());
    }

    async signTransaction(accountId: string, txData: any): Promise<any> {
        const wallet = this._getWalletForAccount(accountId)
        return wallet.signTransaction(txData);
    }

    async signMessage(accountId: string, bytes: Uint8Array): Promise<any> {
        const wallet = this._getWalletForAccount(accountId)
        return wallet.signMessage(bytes);
    }

    async signPersonalMessage(){ throw 'Not implemented' }

    async singTypedData(){ throw 'Not implemented' }

    async exportAccount(accountId: string) {
        const wallet = this._getWalletForAccount(accountId)
        return wallet.getSecret();
    }

    private _initFromMnemonic(mnemonic: string) {
        this.mnemonic = mnemonic
        const seed = bip39.mnemonicToSeed(mnemonic)
        this.hdWallet = HDNode.fromMasterSeed(seed)
    }

    private _getWalletForAccount(accountId: string) {
        const wallet = this._getFlatWallets().find(wallet => wallet.getId() === accountId)
        if (!wallet) throw new Error(`Unable to find wallet for account ${accountId}`)
        return wallet
    }

    private _getFlatWallets(): IWallet[] {
        return Object.entries(this.wallets).reduce((prev, [_, wallets]) => prev.concat(wallets), []);
    }
}

interface ISerialized {
    mnemonic?: string,
    accountNumbers?: { string: number }
}