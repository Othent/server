// Authentication project contract
// Email - lj@communitylabs.com


const PUBLIC_KEY = `-----BEGIN CERTIFICATE-----
MIIC/zCCAeegAwIBAgIJAqzwAV3stXcRMA0GCSqGSIb3DQEBCwUAMB0xGzAZBgNV
BAMTEnNpZ25vLnVzLmF1dGgwLmNvbTAeFw0yMzAxMjcxNzM4NTFaFw0zNjEwMDUx
NzM4NTFaMB0xGzAZBgNVBAMTEnNpZ25vLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZI
hvcNAQEBBQADggEPADCCAQoCggEBALS+cZOq+zSRAHJDKPVieF9zGPkOFYxUr3C4
P3xgOc3IQFQ//k18Tau7XMrBeB04tMHl+WF+EqNfnIYxF/nqfT91EXTTWduvBvJZ
hBLpCPYsq9cof8ai2AKDTp0jEm9hY6z+wLbqgqRq48VodjU2TKHn+jRQNaFBx9rF
lO0NvxcDSE6LWHCbwsbxD2IHxQJTc66HkffPch0L9Ik2jo79gfgr6haV4puXZAQI
pXVEIGFLLZelLbzgA0kb30Q4oJPjxWACPLyqeG3PFrU+QOX3YXBMiWtvKX1BA0Yc
7R3hwvLkg84qEiyBO9sgJLJKIOhBPC0m0Jw37k7d8GJiNx6YhsMCAwEAAaNCMEAw
DwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUPVuX37TB0J3+TH7bTGBOmgcq8Zww
DgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQAXvJYeVmVhu3CbDvy0
0kd1WFFVCC87WQzhOcLtyoTPbV6u7fwTJeos/g/p0u+cPJu8iRO4rL7+Fimd6Oc2
OhLtSpk/NydiWEIafUhteInzkyLzXLqZ59p6UuFU87rdNfMP5ltKCM+11yS0zI64
SoKHBcpBKSMtmh40q2fZOY7VIq7KBwm4A8U5ntHi8PaUH0ekFxb9ejPmccMi06/v
1g/YSMtFJqOKj7lVO+r0yxGrm4Rl9n7LzrBryLM+pbc9FxZv/0w2fszvzTUx0UaI
pwzULqhHK+DMlVJfqSLyE1cnWjo/cQpa4lA5yu6ELc72RsZV6kNwJe+AK4o9cifZ
+GVK
-----END CERTIFICATE-----`




function verifyJWT(JWT, PUBLIC_KEY) {
    const jwt = SmartWeave.extensions.jwt
    try {
        const verifying = jwt.verify(JWT, PUBLIC_KEY, { algorithms: ['RS256'] });
        return verifying
    } catch (e) {
        console.log(e)
        return false
    }
}



export async function handle(state, action) {
    const contractInput = action.input

    // INITIALIZE CONTRACT
    if (contractInput.function === 'initializeContract') { 

        const verify_JWT = verifyJWT(contractInput.jwt, PUBLIC_KEY)

        console.log(verify_JWT)

        if (verify_JWT !== false) {
            state.user_id = verify_JWT.sub;
            state.contract_address = contractInput.contract_address
        }
    }


    // DO A TXN TO MOCK BLOG CONTRACT
    if (contractInput.function === 'broadcastTxn') {

        const verify_JWT = verifyJWT(contractInput.jwt, PUBLIC_KEY)

        if (verify_JWT !== false) {

            if (verify_JWT.sub === state.user_id) {


                // error handle for these
                // interact with other contract
                const toContractId = verify_JWT.toContractId;
                const toContractFunction = verify_JWT.toContractFunction;
                const txnData = verify_JWT.txnData;


                await SmartWeave.contracts.write(toContractId, { 
                    function: toContractFunction, 
                    txnData: txnData }); 

            }
        }
    }

    

    return { state };
}