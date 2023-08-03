import { WarpFactory } from 'warp-contracts';
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';
import { JWTVerifyPlugin } from '@othent/warp-contracts-plugin-jwt-verify';

const warp = WarpFactory.forTestnet().use(new DeployPlugin()).use(new JWTVerifyPlugin());


async function configureWallet() {
    try {
        const wallet = await JSON.parse(process.env.wallet)
        const jwk = new ArweaveSigner(wallet)
        return jwk
    } catch (err) {
        console.log('Error configure\'ing Wallet')
    }
}

export {
    configureWallet, 
    warp
}