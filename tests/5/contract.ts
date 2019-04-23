const expect = require("chai").expect;
const path = require("path");
const { Pact } = require("@pact-foundation/pact");
const { getMeDogs, getMeDog } = require("./api.js");

let url = "http://localhost";
const port = 45000;

const provider = new Pact({
    port: port,
    log: "./logs/mockserver.log",
    dir: "./pacts",
    spec: 2,
    consumer: "MyConsumer",
    provider: "MyProvider",
    pactfileWriteMode: "merge"
});

describe("The Dog API", function() {
    const EXPECTED_BODY = [
        {
            dog: 1
        },
        {
            dog: 2
        }
    ];

    before(async function() {
        // Setup the provider
        let res = await provider.setup();
        console.log("SETUP", res);
    });

    after(async function() {
        // Write Pact when all tests done
        await provider.finalize();
    });

    afterEach(async function() {
        // verify with Pact, and reset expectations
        await provider.verify();
    });

    describe("get /dogs", function() {
        before(async function() {
            const interaction = {
                state: "i have a list of dogs",
                uponReceiving: "a request for all dogs",
                withRequest: {
                    method: "GET",
                    path: "/dogs",
                    headers: {
                        Accept: "application/json"
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: EXPECTED_BODY
                }
            };
            await provider.addInteraction(interaction);
        });

        it("returns the correct response", async function() {
            const urlAndPort = {
                url: url,
                port: port
            };
            const response = await getMeDogs(urlAndPort);
            // expect(response.data).to.eql(EXPECTED_BODY);
        });
    });

    describe("get /dog/1", async function() {
        before(async function() {
            const interaction = {
                state: "i have a list of dogs",
                uponReceiving: "a request for a single dog",
                withRequest: {
                    method: "GET",
                    path: "/dogs/1",
                    headers: {
                        Accept: "application/json"
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: EXPECTED_BODY
                }
            };
            await provider.addInteraction(interaction);
        });

        it("returns the correct response", async function() {
            const urlAndPort = {
                url: url,
                port: port
            };
            const response = await getMeDog(urlAndPort);
            expect(response.data).to.eql(EXPECTED_BODY);
        });
    });
});
