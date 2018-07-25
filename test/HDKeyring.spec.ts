import {HDKeyring} from '../src/HDKeyring';
import {describe, before, it} from 'mocha';
import {expect, assert} from 'chai';
import * as SG from '@waves/waves-signature-generator';


describe('HDKeyring', () => {
    const mnemonic = 'federal pole upset put bone crucial speed stable wire use muscle unit'
    let keyring: HDKeyring;

    beforeEach(() => {
        keyring = new HDKeyring({mnemonic: mnemonic})
    })

    /// Ethereum
    it('Should create valid ETH addresses', async () => {
        const accounts = await keyring.addAccounts()
        //console.log(accounts)
        expect(accounts[0]).to.be.eq('0x12c85a345326e9f6083d2db8012b6b41c13f2b83')
    })

    it('Should create multiple valid ETH addresses', async () => {
        const accounts = await keyring.addAccounts(3)
        //console.log(accounts)
        expect(accounts[0]).to.be.eq('0x12c85a345326e9f6083d2db8012b6b41c13f2b83')
        expect(accounts[1]).to.be.eq('0xf7826f1734c4c8067b73bf7ac830f7e25d28e5bc')
        expect(accounts[2]).to.be.eq('0x503964c4bb8dadc692914f17be11017890e64b35')
    })

    it('Should export ETH accounts', async () => {
        await keyring.addAccounts(3)
        //
        const exported = await keyring.exportAccount('0x12c85a345326e9f6083d2db8012b6b41c13f2b83')
        expect(exported).to.be.eq('0x68ac6b149ad8d6d193628cc955e0d55d19429884ea5382b6867cc7083ba121c6')
    })

    it('Should not export invalid ETH account', async () => {
        await keyring.addAccounts(3)
        try {
            await keyring.exportAccount('0x12c85a345326e9f6083d2db8012b6b41c13f21b83')
            assert(false)
        } catch (e) {
            expect(e.message).equals('Unable to find wallet for account 0x12c85a345326e9f6083d2db8012b6b41c13f21b83')
        }

    })


    // WAVES

    it('Should create valid WAVES PK', async () => {
        const accounts = await keyring.addAccounts(1, 'WAVES')
        const rawPk = SG.libs.base58.decode(accounts[0])
        const address = SG.utils.crypto.buildRawAddress(rawPk)
        expect(SG.utils.crypto.isValidAddress(address)).to.be.true
    })

    // GENERAL
    it('Should have correct number of accounts', async () => {
        await keyring.addAccounts(3)
        await keyring.addAccounts(2, 'WAVES')
        const accounts = await keyring.getAccounts()
        //console.log(accounts)
        expect(accounts.length).to.be.eq(5)
    })
    it('Should throw on unidentified coin type', async () => {
        let failed = false
        try {
            await keyring.addAccounts(1, 'Imaginary')
            assert(failed)
        } catch (e) {
            expect(e.message).equals('Unsupported coin type: Imaginary')
        }
    })

    it('Should serialize and deserialize', async () => {
        await keyring.addAccounts(3)
        const accountsBefore = await keyring.getAccounts()
        const serialized = await keyring.serialize()
        const deserialized = new HDKeyring(serialized)
        const accountsAfter = await deserialized.getAccounts()
        expect(accountsBefore).eql(accountsAfter)
    })

})