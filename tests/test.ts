import * as request from "request-promise-native";

describe("Search", function() {
    it("should be successful", async function() {
        let resp = await request.post(
            "http://ip-5236.sunline.net.ua:30020/users/login",
            {
                json: true,
                body: {
                    email: "wekan_superadmin@ip-5236.sunline.net.ua",
                    password: "wekan_superadmin@ip-5236.sunline.net.ua"
                }
            }
        );
        console.log("Login successful!", resp);
        console.log("You are set up!");
    });
});
