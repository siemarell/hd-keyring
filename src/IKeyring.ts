export interface IKeyring {
    serialize(): Promise<any>
    deserialize(obj:any): Promise<void>
    addAccounts(n: number, type: string): Promise<any[]>
    getAccounts(): Promise<any>
    signTransaction(accountId: string, txData: any): Promise<any>
    signMessage(accountId: string, bytes: Uint8Array): Promise<Uint8Array>
    exportAccount(accountId: string): Promise<string>
}