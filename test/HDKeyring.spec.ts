import {HDKeyring} from '../src/HDKeyring'
import {describe, before, it} from 'mocha';
import {expect, assert} from 'chai'

describe('HDKeyring', () => {
    const mnemonic = 'federal pole upset put bone crucial speed stable wire use muscle unit'
    let keyring : HDKeyring;

    beforeEach(()=>{
        keyring = new HDKeyring({mnemonic: mnemonic})
    })

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

    it('Should have correct number of accounts', async () => {
        await keyring.addAccounts(3)
        const accounts = await keyring.getAccounts()
        //console.log(accounts)
        expect(accounts.length).to.be.eq(3)
    })

    it('Should throw on unidentified coin type', async () => {
        let failed = false
        try {
            await keyring.addAccounts(1, 'Imaginary')
        } catch (e) {
            failed = !failed
        }
        assert(failed, "addAccounts didn't throw")
    })

    it('Should export accounts', async () => {
        await keyring.addAccounts(3)
        const exported = await keyring.exportAccount('0x12c85a345326e9f6083d2db8012b6b41c13f2b83')
        expect(exported).to.be.eq('0x68ac6b149ad8d6d193628cc955e0d55d19429884ea5382b6867cc7083ba121c6')
    })

    it('Should not export invalid', async () => {
        await keyring.addAccounts(3)
        const exported = await keyring.exportAccount('0x12c85a345326e9f6083d2db8012b6b41c13f21b83')
        expect(exported).to.be.undefined
    })
})