import { warp as warpFunction, configureWallet } from './warp-configs.js'
import jwt from 'jsonwebtoken';


export default async function deployContractFromTx(network, srcTxId, contractState, JWT, tags) {


    const decodedJWT = jwt.decode(JWT)

    if (srcTxId !== decodedJWT.srcTxId) {
        return { success: false, error: 'Invalid JWT/srcTxId' }
    }

    const wallet = await configureWallet();
    tags.push( { name: "File-Hash-JWT", value: JWT } )


    const warp = await warpFunction(network)
    const { contractTxId, srcTxId: srcTransactionID } = await warp.deployFromSourceTx({
        wallet: wallet, 
        initState: JSON.stringify(contractState), 
        srcTxId: srcTxId,
        tags
    });


    return { success: true, contractTxId, srcTxId: srcTransactionID }
}
