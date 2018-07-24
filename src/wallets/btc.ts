import {IWallet} from "../interfaces";

export class BtcWallet implements IWallet{
    static fromHdPrivateKey(privateKey: Uint8Array): IWallet{
        throw new Error('Not implemented')
    }

    getId(): string {
        throw new Error('Not implemented')
    }

    getSecret(): string {
        throw new Error('Not implemented')
    }

    signMessage(bytes: Uint8Array): Uint8Array {
        throw new Error('Not implemented')
    }

    signTransaction(tx: any): any {
        throw new Error('Not implemented')
    }

}