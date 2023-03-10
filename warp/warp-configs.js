import { WarpFactory } from "warp-contracts";
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';


import jwt from 'jsonwebtoken';
class JWTPlugin {
    process(input) { input.jwt = jwt }
    type() { return 'smartweave-extension-jwt'; }
}


const warp = WarpFactory.forMainnet().use(new JWTPlugin()).use(new DeployPlugin());

async function configureWallet() {
    try {
        const jwk = new ArweaveSigner(JSON.stringify(process.env.wallet))
        return jwk
    } catch (err) {
        console.log('Error configure\'ing Wallet')
    }
}


// now we can export warp as well as our configure wallet 
export {
    configureWallet, 
    warp
}