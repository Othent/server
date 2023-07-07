import { warp, configureWallet } from "../warp/warp-configs.js";


export default async function transferU(contract_id) {

    const connectedWallet = warp.contract('KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw').connect(configureWallet.jwk);

    const transfer = await connectedWallet.writeInteraction({
        function: 'transfer',
        target: contract_id,
        qty: 100000 // transfer 0.1 
    });

    console.log(transfer)

    return { success: true }
}
