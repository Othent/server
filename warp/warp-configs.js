import { WarpFactory, defaultCacheOptions } from 'warp-contracts';
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';
import { JWTVerifyPlugin } from '@othent/warp-contracts-plugin-jwt-verify';


async function warp(network) {
    if (network === 'mainNet') {
        const warp = WarpFactory.forMainnet({ ...defaultCacheOptions, dbLocation: './cache/warp/mainNet' }).use(new DeployPlugin()).use(new JWTVerifyPlugin());
        return warp
    } else if (network === 'testNet') {
        const warp = WarpFactory.forTestnet({ ...defaultCacheOptions, dbLocation: './cache/warp/testNet' }).use(new DeployPlugin()).use(new JWTVerifyPlugin());
        return warp
    } else {
        throw new Error('Error init warp!')
    }
}


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