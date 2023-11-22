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
    if (!(await isValidToken(event.headers["Authorization"]))) {
        return {
            statusCode: 401,
            body: "Unauthorized",
        };
    }

    if (!event.body) {
        return {
            statusCode: 400,
            body: "Bad request",
        };;
    }

    const repeater: Repeater = JSON.parse(event.body);

    if (!isRepeaterObject(repeater)) {
        return {
            statusCode: 400,
            body: "Bad request",
        };
    }

    if (repeater.action === "repeat") {
        console.log({repeater});
        return {
            statusCode: 200,
            body: JSON.stringify(repeater),
        };
    }

    if (repeater.action === "log") {
        console.log({repeater});
        return {
            statusCode: 200,
            body: "",
        };
    }

    return {
        statusCode: 400,
        body: "Bad request",
    };
};
