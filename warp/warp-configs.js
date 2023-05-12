import { WarpFactory } from "warp-contracts";
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';


import jwt from 'jsonwebtoken';
class JWTPlugin {
    process(input) { input.verify = jwt.verify }
    type() { return 'smartweave-extension-jwt'; }
}


const warp = WarpFactory.forMainnet().use(new DeployPlugin()).use(new JWTPlugin());

async function configureWallet() {
    try {
        const wallet = await JSON.parse(process.env.wallet)
        const jwk = new ArweaveSigner(wallet)
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