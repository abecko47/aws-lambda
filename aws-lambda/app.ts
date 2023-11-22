import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {Algorithm, verify} from "jsonwebtoken";
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

    const validatorResponse = await axios.get<PublicKeyDto>("https://auth.plasmics.com/.well-known/jwks.json");
    if (validatorResponse.data.keys.length === 0) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Couldn't read public key",
            }),
        };
    }

    const key = validatorResponse.data.keys[0];
    const algorithm = validatorResponse.data.alg;

    //
    const validate = verify("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InJ1Nl82RC1FdUVwMmtJbWFIbmotWiJ9.ey" +
        "Jpc3MiOiJodHRwczovL2F1dGgucGxhc21pY3MuY29tLyIsInN1YiI6ImF1dGgwfDY1NWNiNDJkZ" +
        "jNiMWIzODM1NzgxYmVhYSIsImF1ZCI6WyJjaGFsbGVuZ2VBUEkiLCJodHRwczovL3BsYXNta" +
        "WNzLmV1LmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MDA1NzQ3NjcsImV4cCI6MT" +
        "cwMDY2MTE2NywiYXpwIjoiRzNDd2s0eFVKYnRwdnlEU01OS2N0OG1JTVNpdzZDRUkiLCJzY" +
        "29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwicGVybWlzc2lvbnMiOlsiY2hhbGxlbmdlOmFjY" +
        "2VzcyJdfQ.ZlqjF3OqZilo-G3LfKiZdee5qThwV0NSP3CXippvhZmeo-" +
        "5ttZ5KZQyM4ANYJ9UUFK7PRhkyh4S0bEAXgriLwCpaHYdot7J0SOIGq6nDXW_V-" +
        "_KiGXqIrh7nFT4zqTRRd_VkB0Sj2BHy_g1KUmVEMfN_eVjDzpJeFyAL-" +
        "7eYwgyJgkcjYX9BOdfKzaq8d_xBVLZB7tbrS4raMH2g5lridQ9YN5B_tI419zGAntBQp2FKKVKA" +
        "E1xD5Kx_13aN_7pkfrME7GCqme0QIZ5VPhGjAWhlylZdku1nK06Ncq1Yu8_Sorf9gvMAORWj2j" +
        "wY7_2NKl_0Ge2lCDs9XNAI3u8GVQ", key.n, {algorithms: [algorithm as Algorithm]});

    console.log({validate})


    console.log(12123)

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
