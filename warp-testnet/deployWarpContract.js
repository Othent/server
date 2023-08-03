import { warp, configureWallet } from './warp-configs.js'
import { sha256 } from 'crypto-hash';
import jwt from 'jsonwebtoken';


export default async function deployWarpContract(contractSrc, contractState, JWT, tags) {

    const hashOfContractSrc = await sha256(contractSrc)
    const decodedJWT = jwt.decode(JWT)

    if (hashOfContractSrc !== decodedJWT.file_hash) {
        return { success: false, error: 'Invalid JWT/ContractSrc' }
    }

    const wallet = await configureWallet();
    tags.push( { name: "File-Hash-JWT", value: JWT } )


    const contractResponse = await warp.deploy({
        wallet: wallet, 
        initState: JSON.stringify(contractState), 
        src: contractSrc,
        tags
    });


    return contractResponse
}

