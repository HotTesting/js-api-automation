import { request, rawRequest, GraphQLClient } from "graphql-request";

export class GQLRequest {
    protected options: any;

    constructor(protected gqlURL: string = "http://localhost:8080/graphql") {
        this.options = {
            gqlURL: this.gqlURL,
            query: null,
            variables: undefined,
            headers: {}
        };
    }

    query(query: string) {
        this.options.query = query;
        return this;
    }

    headers(headers: Object) {
        this.options.headers = Object.assign(this.options.headers, headers);
        return this;
    }

    variables(variables: Object) {
        this.options.variables = variables;
        return this;
    }

    async send() {
        const { gqlURL, query, variables, headers } = this.options;

        const graphQLClient = new GraphQLClient(gqlURL, {
            headers: headers
        });
        return await graphQLClient.rawRequest(query, variables);
    }
}
