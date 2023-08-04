import jwkToPem from 'jwk-to-pem';
import crypto from 'crypto';


async function sign(data) {

    const pemKey = jwkToPem(process.env.wallet, { private: true });

    const sign = crypto.createSign('sha256');
    sign.update(data);
    sign.end();

    const signature = sign.sign({
        key: pemKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: 15
    });


    return signature

}

export default sign;