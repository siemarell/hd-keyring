import * as SG from '@waves/waves-signature-generator'
import {IWallet} from "../interfaces";
import {create, TESTNET_CONFIG} from '@waves/waves-api'

type KeyPair = {private: Uint8Array, public:Uint8Array}

export class WavesWallet implements IWallet {
    static fromHdPrivateKey(privateKey: Uint8Array): IWallet {
        const keyPair: KeyPair = SG.libs.axlsign.generateKeyPair(privateKey)
        return new WavesWallet(keyPair)
    }

    private Waves = create(TESTNET_CONFIG)

    private constructor(private keyPair: KeyPair) {

    }


    getId(): string {
        return SG.libs.base58.encode(this.keyPair.public)
    }

    getSecret(): string {
        return SG.libs.base58.encode(this.keyPair.private)
    }

    // async signMessage(bytes: Uint8Array):Promise<any> {
    //     return undefined;
    // }

    async signTransaction(txData: any) {
        const tools = <any>this.Waves.tools
        const transfer = await tools.createTransaction(txData.type, txData)
        transfer.addProof(this.getSecret())
        return await transfer.getJSON()
    }
}
