export interface IWallet {
    getId(): string
    getSecret(): string
    signTransaction(tx: any): any
    signMessage(bytes: Uint8Array): Uint8Array
}

export type IWalletClass = {
    fromHdPrivateKey(privateKey: Uint8Array): IWallet
}