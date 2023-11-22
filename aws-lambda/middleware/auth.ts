import jwt, {Algorithm} from "jsonwebtoken";
import JwksRsa from "jwks-rsa";

export const isValidToken = async (token: string | undefined): Promise<boolean> => {
    if (!token) {
        return false;
    }

    const decodedToken = jwt.decode(token, { complete: true });

    if (!decodedToken) {
        return false;
    }

    const algorithm: Algorithm = decodedToken.header.alg as Algorithm;

    const publicKey = (await JwksRsa({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://auth.plasmics.com/.well-known/jwks.json`
    }).getSigningKey(decodedToken.header.kid)).getPublicKey();

    try {
        jwt.verify(token, publicKey,{algorithms: [algorithm]});
    } catch {
        return false
    }

    return true;
}