import * as RAML from "raml-1-parser";
import { URL } from "url";
import * as URItemplate from "uri-templates";

let RAML_API: RAML.api10.Api = null;

function parseAPI(ramlFilePath: string = "./api.raml"): RAML.api10.Api {
    // Lazy load of file
    if (!RAML_API) {
        RAML_API = RAML.loadApiSync("./api.raml", {
            rejectOnErrors: true
        }) as RAML.api10.Api;
    }
    return RAML_API;
}

function getResponseBodyDeclaration(
    uri: string,
    methodName: string = "get",
    statusCode: string = "200"
): RAML.api10.TypeDeclaration {
    try {
        const API = parseAPI();
        const parsedURL = new URL(uri); // .pathname
        for (let resource of API.allResources()) {
            // console.log(
            //     "Trying to match:",
            //     resource.completeRelativeUri(),
            //     parsedURL.pathname
            // );
            if (
                URItemplate(resource.completeRelativeUri()).test(
                    parsedURL.pathname
                )
            ) {
                const methodNode = resource.childMethod(
                    methodName.toLowerCase()
                )[0];
                for (const resp of methodNode.responses()) {
                    if (resp.code().value() == statusCode) {
                        return resp.body()[0];
                    }
                }
            }
        }
        throw new Error(
            `Cannot find declaration for: ${methodName}: ${statusCode}: ${uri}`
        );
    } catch (err) {
        console.log(
            `Cannot find declaration for: ${methodName}: ${statusCode}: ${uri}`
        );
        console.log(err);
        throw err;
    }
}

export function validateBodyFor(
    uri: string,
    bodyObj: any,
    methodName: string,
    statusCode: string
) {
    const statuses = getResponseBodyDeclaration(
        uri,
        methodName,
        statusCode
    ).validateInstanceWithDetailedStatuses(bodyObj);

    if (statuses.length > 0) {
        const messages = statuses
            .map(st => {
                return JSON.stringify({ code: st.code, msg: st.getMessage() });
            })
            .join("\n\r");

        // console.log(statuses)
        console.log(`${methodName}: ${statusCode}: ${uri} `, bodyObj);
        throw new Error(`Validation for ${methodName}: ${statusCode}: ${uri} is failed:
        ${messages}`);
    }
    return;
}
