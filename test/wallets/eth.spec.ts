import {describe, before, it} from 'mocha';
import {expect, assert} from 'chai';
import * as SG from '@waves/waves-signature-generator';
import {IWallet} from "../../src/interfaces";
import {EthWallet} from "../../src/wallets";


describe('EthWallet', () => {
    //const privateKey =new Uint8Array([104, 172, 107, 20, 154, 216, 214, 209, 147, 98, 140, 201, 85, 224, 213, 93, 25, 66, 152, 132, 234, 83, 130, 182, 134, 124, 199, 8, 59, 161,33, 198])
    const privateKey = '68ac6b149ad8d6d193628cc955e0d55d19429884ea5382b6867cc7083ba121c6'
    let wallet: EthWallet;

    beforeEach(() => {
        wallet = EthWallet.fromHdPrivateKey(Buffer.from(privateKey, 'hex'))
    })

    it('Should correctly implement signMessage (eth_sign)', () => {
        const msg = 'Hello'
        const msgHash = SG.libs.keccak256('\x19Ethereum Signed Message:\n' + msg.length + msg);
        const sig = '0xb35e661fe3ed8d3828fa715a6abe51fc5ca8916d440f2488d0823e95579f496626f883487ca9ddc2cf2bf7a9182451c7638448467cf759943d104423020b45061c'
        const signature = wallet.signMessage(msgHash)
        expect(sig).equals(signature)
    })



})



