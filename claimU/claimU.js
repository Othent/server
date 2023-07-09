import transferU from "./sendUWarp.js"
import checkIfClaimed from "./checkIfClaimed.js"

export default async function claimU(userDetails) {

    const contract_id = userDetails.contract_id
    const userId = userDetails.sub
    const checkWalletStatus = await checkIfClaimed(userId)

    try {
        if (checkWalletStatus === false) {
            const { transfer } = await transferU(contract_id)
            if (transfer.originalTxId) {
                return { success: true, transfer, claimedU: 100000 }
            } else {
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