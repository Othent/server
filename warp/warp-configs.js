import { WarpFactory, defaultCacheOptions } from 'warp-contracts';
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';
import { LmdbCache } from 'warp-contracts-lmdb'


async function warp(network, customDREURL) {
  
  if (network === 'mainNet') {
    
    const warp = WarpFactory.forMainnet().use(new DeployPlugin())
    .useStateCache(new LmdbCache(
      { ...defaultCacheOptions, dbLocation: `./cache/warp/mainNet/state` }, 
      { maxEntriesPerContract: 100, minEntriesPerContract: 10 }
    ))
    .useContractCache(
      new LmdbCache({ ...defaultCacheOptions, dbLocation: `./cache/warp/mainNet/contracts` }), 
      new LmdbCache({ ...defaultCacheOptions, dbLocation: `./cache/warp/mainNet/src` }
    ));
    return warp

  } else if (network === 'testNet') {

    const warp = WarpFactory.forTestnet().use(new DeployPlugin())
    .useStateCache(new LmdbCache(
      { ...defaultCacheOptions, dbLocation: `./cache/warp/testNet/state` }, 
      { maxEntriesPerContract: 100, minEntriesPerContract: 10 }
    ))
    .useContractCache(
      new LmdbCache({ ...defaultCacheOptions, dbLocation: `./cache/warp/testNet/contracts` }), 
      new LmdbCache({ ...defaultCacheOptions, dbLocation: `./cache/warp/testNet/src` }
    ));
    return warp

  } else if (network === 'mainNet' && customDREURL) {

    const warp = WarpFactory.forMainnet().use(new DeployPlugin())
    .useGwUrl(customDREURL)
    .useStateCache(new LmdbCache(
      { ...defaultCacheOptions, dbLocation: `./cache/warp/mainNet/state` }, 
      { maxEntriesPerContract: 100, minEntriesPerContract: 10 }
    ))
    .useContractCache(
      new LmdbCache({ ...defaultCacheOptions, dbLocation: `./cache/warp/mainNet/contracts` }), 
      new LmdbCache({ ...defaultCacheOptions, dbLocation: `./cache/warp/mainNet/src` }
    ));
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