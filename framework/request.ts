import * as request from "request-promise-native";
import { URL } from "url";

export class Request {
    protected client = request;
    private options: request.OptionsWithUri;

    constructor(absoluteURL: string) {
        // initializing options object
        this.options = {
            uri: absoluteURL,
            method: "GET" // Doing GET request by default
        };

        this.client = request.defaults({
            json: true, // sets body to JSON representation of value and adds Content-type: application/json header. Additionally, parses the response body as JSON - https://github.com/request/request
            time: true, // For logging purposes
            resolveWithFullResponse: true, // To get full response, not just body
            followAllRedirects: true
        });
    }

    /**
     * POST, GET supported
     * @param method method name string
     */
    public method(method: "POST" | "GET"): Request {
        this.options.method = method;
        return this;
    }

    public queryParameters(queryParameters: Object): Request {
        this.options.qs = queryParameters;
        return this;
    }

    public headers(headers: Object) {
        this.options.headers = headers;
        return this;
    }

    /**
     * Set jar with cookies for this request
     * @param cookiesJar
     */
    public cookies(cookiesJar) {
        this.options.jar = cookiesJar;
        return this;
    }

    public async send(): Promise<request.FullResponse> {
        // Sending request with collected options, will be merged with default params.
        let response = this.client(this.options);
        this.logResponse(response);
        return response;
    }

    /**
     * Helper function to print response
     * @param responsePromise
     */
    private async logResponse(responsePromise: request.RequestPromise<any>) {
        try {
            let response = await responsePromise;
            console.log(
                `${this.options.method}:${response.statusCode}: ${
                    this.options.uri
                } took: ${response.timingPhases.total.toFixed()} ms`
            );
            // console.log(
            //     `RESPONSE BODY: ${JSON.stringify(response.body, null, 2)}`
            // );
        } catch (error) {
            if (error.response) {
                console.warn(
                    `${this.options.method}:${error.response.statusCode}: ${
                        this.options.uri
                    } took: ${error.response.timingPhases.total} ms`
                );
                // console.warn(
                //     `RESPONSE BODY: ${JSON.stringify(
                //         error.response.body,
                //         null,
                //         2
                //     )}`
                // );
            } else {
                console.warn(error.message || error);
            }
        }
    }
}
