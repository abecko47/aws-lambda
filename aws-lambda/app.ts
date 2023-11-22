import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import jwt, {Algorithm} from "jsonwebtoken";
import JwksRsa from "jwks-rsa";
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

type PublicKeyDto = {
    keys: {
        kty: string,
        n: string,
        e: string,
        kid: string,
        x5t: string,
        x5c: string[],
    }[],
    alg: string,
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    const headers = event.headers;

    if (!headers["Authorization"]) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                message: "Unaithorized",
            }),
        };
    }

    const token = headers["Authorization"];
    const decodedToken = jwt.decode(token, { complete: true });


    if (!decodedToken || !decodedToken.header.kid || !decodedToken.header.alg) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                message: "Unaithorized",
            }),
        };
    }

    const algorithm: Algorithm = decodedToken.header.alg as Algorithm;

    const publicKey = (await JwksRsa({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://auth.plasmics.com/.well-known/jwks.json`
    }).getSigningKey(decodedToken?.header.kid)).getPublicKey();

    try {
        jwt.verify(token, publicKey,{algorithms: [algorithm]});
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({
                message: "Unaithorized",
            }),
        };
    }

    try {
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'hello world',
            }),
        };
    } catch (err: unknown) {
        console.error(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }

    return response;
};
