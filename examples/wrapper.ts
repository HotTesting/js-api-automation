import { Request } from "../framework/request";

describe("HTTP", function() {
    it("headers", async function() {
        let resp = await new Request("https://httpbin.org/anything")
            .headers({
                test: "test",
                test2: "test2"
            })
            .send();

        console.log("Response", resp.body);
    });

    it("query params", async function() {
        let resp = await new Request("https://httpbin.org/anything")
            .queryParameters({
                test3: "test3"
            })
            .send();
        console.log("Response", resp.body);
    });
});
