export interface IWallet {
    getId(): string
    getSecret(): Promise<string>
    signTransaction(tx: any): Promise<any>
    //signMessage(msgHash: string): string
}

export type IWalletClass = {
    fromHdPrivateKey(privateKey: Uint8Array): IWallet
}