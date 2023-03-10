import { WarpFactory } from "warp-contracts";


import jwt from 'jsonwebtoken';
class JWTPlugin {
    process(input) { input.jwt = jwt }
    type() { return 'smartweave-extension-jwt'; }
}


const warp = WarpFactory.forMainnet().use(new JWTPlugin())
async function configureWallet() {
    try {
        const jwk = await JSON.parse(process.env.wallet)
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