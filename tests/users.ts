import { Request } from "../framework/request";
import * as faker from "faker";
import { expect } from "chai";

describe("User", function() {
    it("self register should be successful", async function() {
        // Generating random email
        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );
        const resp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/users/register"
        )
            .method("POST")
            .body({
                username: faker.internet.userName(),
                email: email,
                password: email
            })
            .send();

        expect(resp.body, resp.body)
            .to.be.an("object")
            .that.has.all.keys("token", "tokenExpires", "id");
        expect(typeof resp.body.token, resp.body).to.equal("string");
        expect(typeof resp.body.tokenExpires, resp.body).to.equal("string");
        expect(typeof resp.body.id, resp.body).to.equal("string");
    });

    it("creating new user should be successful", async function() {
        // login as admin
        const adminLoginResp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/users/login"
        )
            .method("POST")
            .body({
                email: "test@test.com",
                password: "123456"
            })
            .send();

        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );

        const userCreateResp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/api/users"
        )
            .method("POST")
            .auth(adminLoginResp.body.token)
            .body({
                email: email,
                password: email
            })
            .send();

        expect(userCreateResp.body, JSON.stringify(userCreateResp.body))
            .to.be.an("object")
            .that.has.key("_id");
        expect(typeof userCreateResp.body._id, userCreateResp.body).to.equal(
            "string"
        );
    });

    it.only("receiving information about user by id should be successful", async function() {
        // login as admin
        const adminResp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/users/login"
        )
            .method("POST")
            .body({
                email: "test@test.com",
                password: "123456"
            })
            .send();

        const userDetailsResp = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/users/${
                adminResp.body.id
            }`
        ).send();

        expect(userDetailsResp.body, JSON.stringify(userDetailsResp.body))
            .to.be.an("object")
            .that.has.all.keys("_id");

        expect(typeof userDetailsResp.body._id, userDetailsResp.body).to.equal(
            "string"
        );
    });
});
