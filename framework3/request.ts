import * as request from "request-promise-native";
import { URL } from "url";
import { validateBodyFor } from "./RAMLvalidator";
import { CookieJar, RequestAPI, RequiredUriUrl, Response } from "request";

// Shortcut for request type
type RequestClient<T> = RequestAPI<
    request.RequestPromise<TypifiedResponse<T>>,
    request.RequestPromiseOptions,
    RequiredUriUrl
>;

// Own Response type to support typified bodies
interface TypifiedResponse<T = any> extends Response {
    body: T;
}

export class Request<T> {
    protected client: RequestClient<T>;
    protected options: request.OptionsWithUri;

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
        }) as RequestClient<T>;
    }

    /**
     * POST, GET supported
     * @param method method name string
     */
    public method(method: "POST" | "GET"): Request<T> {
        this.options.method = method;
        return this;
    }

    public queryParameters(queryParameters: Object): Request<T> {
        this.options.qs = queryParameters;
        return this;
    }

    public headers(headers: Object): Request<T> {
        this.options.headers = headers;
        return this;
    }

    /**
     * Set jar with cookies for this request
     * @param cookiesJar
     */
    public cookies(cookiesJar: CookieJar): Request<T> {
        this.options.jar = cookiesJar;
        return this;
    }

    /**
     * Set a token for Authentication Bearer header
     * Do not set if token is not passed
     * @param token string
     */
    public auth(token: string): Request<T> {
        if (token) {
            this.options.auth = {
                bearer: token
            };
        }
        return this;
    }

    public body(reqBody): Request<T> {
        this.options.body = reqBody;
        return this;
    }

    public async send(): Promise<TypifiedResponse<T>> {
        // Sending request with collected options, will be merged with default params.
        let response = this.client(this.options);
        this.logResponse(response);
        return this.validateAgainstRAML(response)
    }

    /**
     * Helper function to print response
     * @param responsePromise
     */
    private async logResponse(
        responsePromise: request.RequestPromise<TypifiedResponse<T>>
    ) {
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

    private async validateAgainstRAML(response:request.RequestPromise<TypifiedResponse<T>>) {
        let uri = null;
        try {
            const resp = await response;
            uri = resp.request["href"].toString();

            validateBodyFor(uri, resp.body, resp.request.method, resp.statusCode.toString());
            // console.log(
            //     `Validation against RAML documentation for ${uri} passed`
            // );
        } catch (error) {
            console.error(
                `Validation against RAML documentation for ${uri} FAILED`
            );
            error.response = response;
            throw error;
        }
        return response;
    }
}

// let resp = new Request<{ test: "test" }>("").send().then(data=> data.body.test)
