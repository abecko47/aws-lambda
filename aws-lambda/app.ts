import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {verify} from "jsonwebtoken";
import axios from "axios";

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
    keys: {kty: string, use: string, n: string}[],
    alg: string,
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    const publicKey = await axios.get<PublicKeyDto>("https://auth.plasmics.com/.well-known/jwks.json");
    if (publicKey.data.keys.length === 0) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Couldn't read public key",
            }),
        };
    }

    const key = publicKey.data.keys[0];

    const validate = verify("", key.n);
    console.log(validate)

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
