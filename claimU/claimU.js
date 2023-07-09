import transferU from "./sendUWarp.js"


export default async function claimU(userDetails) {

    const contract_id = userDetails.contract_id
    // const userId = userDetails.sub, later add check

    const checkWalletStatus = true

    try {
        if (checkWalletStatus) {
            const { transfer } = await transferU(contract_id)
            if (transfer.originalTxId) {
                console.log(transfer.originalTxId)
                return { success: true, transfer, claimedU: 100000 }
            } else {
                console.log(transfer.originalTxId)
                return { success: false, transfer }
            }
        } else {
            return { success: 'alreadyClaimed' }
        }
    } catch (e) {
        console.log(e)
        return { success: false, error: e }
    }
}