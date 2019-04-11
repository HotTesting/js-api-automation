import * as request from "request-promise-native";
import * as fs from "fs";

describe("HTTP", function() {
    it("headers", async function() {
        let resp = await request.get("https://httpbin.org/headers", {
            headers: {
                test: "test",
                test2: "test2"
            }
        });
        console.log("Response", resp);
    });

    it("query parameters", async function() {
        let resp = await request.get("https://httpbin.org/anything", {
            qs: {
                test3: "test3"
            }
        });
        console.log("Response", resp);
    });

    it("file upload and download", async function() {
        const formData = {
            my_file: fs.createReadStream(__dirname + "/cat.png")
        };
        let resp = await request.post("https://httpbin.org/anything", {
            formData: formData
        });
        fs.createWriteStream(__dirname + `/cat_new.txt`).write(resp);
        let parsed = JSON.parse(resp);
        var base64Data = parsed.files.my_file.replace(
            /^data:image\/png;base64,/,
            ""
        );
        fs.writeFile(__dirname + "/out.png", base64Data, "base64", () => {});
    });

    it("cookies", async function() {
        let cookieJar = request.jar();
        let loginResp = await request.get(
            "https://httpbin.org/cookies/set",
            {
                json: true,
                jar: cookieJar,
                qs: {
                    testCookie1: "first",
                    testCookie2: "second",
                }
            }
        );
        console.log(cookieJar);
        console.log(loginResp);
        let currentUser = await request.get(
            "https://httpbin.org/cookies",
            {
                json: true,
                jar: cookieJar
            }
        );
        console.log(currentUser);
    });

    it("authentification", async function() {
        // login as admin
        let loginResp = await request.post(
            "http://ip-5236.sunline.net.ua:30020/users/login",
            {   
                json: true,
                body: {
                    email: "test@test.com",
                    password: "123456"
                }
                
            }
        );
        console.log(loginResp.headers);

        let currentUser = await request.get(
            "http://ip-5236.sunline.net.ua:30020/api/user",
            {
                json: true,
                auth: {
                    'bearer': loginResp.token
                }
            }
        );

        console.log(currentUser);
    });
});
