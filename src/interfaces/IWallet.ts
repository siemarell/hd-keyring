export interface IWallet {
    getId(): string
    getSecret(): string
    //fromHdPrivateKey(sk: Uint8Array): IWallet
    signTransaction(tx: any): any
    signMessage(bytes: Uint8Array): Uint8Array
}