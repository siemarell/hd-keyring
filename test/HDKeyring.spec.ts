import {HDKeyring} from '../src/HDKeyring'
import {describe, before, it} from 'mocha';
import {expect, assert} from 'chai'

describe('HDKeyring', () => {
    const mnemonic = 'federal pole upset put bone crucial speed stable wire use muscle unit'

    it('Should create ETH addresses', async () => {
        const keyring = new HDKeyring({mnemonic: mnemonic})
        const wallets = await keyring.addAccounts()
        console.log(wallets)
        expect(wallets[0].getAddress().toString('hex')).to.be.eq('12c85a345326e9f6083d2db8012b6b41c13f2b83')
    })

    it('Should throw on unidentified coin type', async () => {
        const keyring = new HDKeyring({mnemonic: mnemonic})
        let failed = false
        try {
            await keyring.addAccounts(1, 'Imaginary')
        } catch (e) {
            failed = !failed
        }
        assert(failed,"addAccounts didn't throw")
    })
})