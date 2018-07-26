import {IWallet} from "../interfaces";

export class BtcWallet implements IWallet{
    static fromHdPrivateKey(privateKey: Uint8Array): IWallet{
        throw new Error('Not implemented')
    }

    getId(): string {
        throw new Error('Not implemented')
    }

    async getSecret(): Promise<string> {
        throw new Error('Not implemented')
    }

    async signMessage(bytes: Uint8Array): Promise<any> {
        throw new Error('Not implemented')
    }

    async signTransaction(tx: any): Promise<any> {
        throw new Error('Not implemented')
    }

}