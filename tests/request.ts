import * as request from "request-promise-native";

export class RequestNew {
    url;
    options
    constructor(url) {
        this.url = url;

        this.options = {}
    }

    method(type: "GET" | "POST") {
        this.options.method = type
        return this
    }

    get() {
        this.options.method = 'GET'
        return this
    }

    body(bdy) {
        this.options.body = bdy
        return this
    }

    send() {
        return request(this.options)
    }
}

new RequestNew('http://test.com').method('POST').body({name: 'test'})
