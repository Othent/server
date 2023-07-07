import transferU from "./sendUWarp.js"


export default async function claimU(userDetails) {

    const contract_id = userDetails.contract_id
    // const userId = userDetails.sub, later add check

    const checkWalletStatus = true

    try {
        if (checkWalletStatus) {
            const transferTokens = await transferU(contract_id)
            if (transferTokens.success.true) {
                return { success: true }
            } else {
                return { success: false }
            }
        } else {
            return { success: 'alreadyClaimed' }
        }
    } catch (e) {
        console.log(e)
        return { success: false, error: e }
    }
}

