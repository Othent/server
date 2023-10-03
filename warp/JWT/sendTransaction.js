import { warp as warpFunction, configureWallet } from '../warp-configs.js'
import queryDB from '../../database/queryDB.js'
import addEntry from '../../patnerDashboard/addEntry.js'

export default async function sendTransaction(network, JWT, tags, clientID) {
    let logs = [];
    
    const originalLog = console.log;
    console.log = function (...args) {
        logs.push(args.join(' '));
        originalLog.apply(console, args);
    };

    try {
        const checkDB = await queryDB(JWT)
        if (checkDB.response === 'user not found') {
            return { success: false, message: 'Please create an Othent account', logs }
        }
        const decodedJWT = checkDB;
    
        const wallet = await configureWallet()
        const warp = await warpFunction(network)
        let contract;
        if (network === 'mainNet') {
            contract = warp.contract(decodedJWT.contract_id).setEvaluationOptions({ internalWrites: true, remoteStateSyncEnabled: true }).connect(wallet.jwk)
        } else {
            contract = warp.contract(decodedJWT.test_net_contract_id).setEvaluationOptions({ internalWrites: true, remoteStateSyncEnabled: true }).connect(wallet.jwk)
        }
    
        tags.push({ name: "Contract-App", value: "Othent.io" }, { name: "Function", value: "sendTransaction" });
        const options = { tags };
    
        const transaction = await contract.writeInteraction({
            function: 'sendTransaction',
            jwt: JWT,
            encryption_type: 'JWT'
        }, options);
    
        const { cachedValue } = await contract.readState();
        const { state, validity, errorMessages } = cachedValue;
        const transactionId = transaction.originalTxId;
    
        if (errorMessages[transactionId]) {
            const entry = addEntry(clientID, decodedJWT.contract_id, decodedJWT.sub, transactionId, 'sendTransactionWarp', 'warp-transaction', false);
            return { success: false, transactionId, bundlrId: transaction.bundlrResponse.id, errors: errorMessages[transactionId], entry, logs };
        }
    
        addEntry(clientID, decodedJWT.contract_id, decodedJWT.sub, transactionId, 'sendTransactionWarp', 'warp-transaction', true);
        return { success: true, transactionId, bundlrId: transaction.bundlrResponse.id, errors: {}, logs };
    } catch (e) {
        return { success: false, errors: JSON.stringify(e), logs };
    } finally {
        console.log = originalLog;
    }
}
