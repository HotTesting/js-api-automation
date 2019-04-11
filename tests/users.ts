import * as request from "request-promise-native";
import * as faker from "faker";
import { expect } from "chai";

describe("User", function() {
    it("self register should be sucessful", async function() {
        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );
        let resp = await request.post(
            "http://ip-5236.sunline.net.ua:30020/users/register",
            {
                json: true,
                body: {
                    username: faker.internet.userName(),
                    email: email,
                    password: email
                }
            }
        );
        expect(resp)
            .to.be.an("object")
            .that.has.all.keys("token", "tokenExpires", "id");
        expect(typeof resp.token, resp.token).to.equal("string");
        expect(typeof resp.tokenExpires, resp.tokenExpires).to.equal("string");
        expect(typeof resp.id, resp.id).to.equal("string");
    });

    it("creating new user should be sucessful", async function() {
        // login as admin
        let adminLoginResp = await request.post(
            "http://ip-5236.sunline.net.ua:30020/users/login",
            {
                json: true,
                body: {
                    email: "test@test.com",
                    password: "123456"
                }
            }
        );

        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );
        let resp = await request.post(
            "http://ip-5236.sunline.net.ua:30020/api/users",
            {
                headers: {
                    Authorization: `Bearer ${adminLoginResp.token}`
                },
                json: true,
                body: {
                    username: faker.internet.userName(),
                    email: email,
                    password: email
                }
            }
        );
        expect(resp, JSON.stringify(resp))
            .to.be.an("object")
            .that.has.key("_id");
        expect(typeof resp._id, resp._id).to.equal("string");
    });
});
