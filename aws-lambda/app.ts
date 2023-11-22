import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {isValidToken} from "./middleware/auth";
import {isRepeaterObject, Repeater} from "./util/dto";
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Bad request",
            }),
        };
    }

    const body = JSON.parse(event.body);

    if (!isRepeaterObject(body)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Bad request",
            }),
        };
    }


    if (!(await isValidToken(event.headers["Authorization"]))) {
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
