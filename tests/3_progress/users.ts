import { Request } from "../../framework/request";
import * as faker from "faker";
import { expect } from "chai";
import { Response } from 'request';

class UsersController {
    baseURL;
    token;
    
    constructor(baseURL?: string, token?: string) {
        if (baseURL) {
            this.baseURL = baseURL
        } else if (process.env.BASE_URL) {
            this.baseURL = process.env.BASE_URL;
        } else {
            this.baseURL = "http://ip-5236.sunline.net.ua:30020"
        }
        this.token = token
    }

    async login(email, password) {
        const adminLoginResp = await new Request(`${this.baseURL}/users/login`)
            .method("POST")
            .body({
                email: email,
                password: password
            })
            .send();
        return adminLoginResp.body;
    }

    async createUser(email, password, username) {
        const userCreateResp = await new Request(
            `${this.baseURL}/api/users`
        )
            .method("POST")
            .auth(this.token)
            .body({
                email: email,
                password: password,
                username: username
            })
            .send();
        return userCreateResp.body
    }
}

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

    it.only("creating new user should be successful", async function() {
        // login as admin
        let userController = new UsersController();
        let adminLoginResp = await userController.login(
            "test@test.com",
            "123456"
        );

        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );
        const username = faker.internet.userName()
        
        let adminUserController = new UsersController(adminLoginResp.token)
        let userCreateResp = await adminUserController.createUser(email, email, username)
            try {
                let userCreateResp = await new UsersController().createUser(email, email, username)
            } catch (err) {
                expect(err.response.statusCode).to.equal(401)
            }

        expect(userCreateResp, JSON.stringify(userCreateResp))
            .to.be.an("object")
            .that.has.key("_id");
        expect(typeof userCreateResp._id, userCreateResp).to.equal(
            "string"
        );
    });

    it("receiving information about user by id should be successful", async function() {
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
            `http://ip-5236.sunline.net.ua:30020/api/users/${adminResp.body.id}`
        )
            .auth(adminResp.body.token)
            .send();

        const usrDetails = userDetailsResp.body;
        expect(usrDetails, JSON.stringify(usrDetails))
            .to.be.an("object")
            .that.has.keys(
                "_id",
                "authenticationMethod",
                "createdAt",
                "emails",
                "isAdmin",
                "profile",
                "services",
                "username"
            );

        // console.log("USER", usrDetails);
        expect(usrDetails._id, usrDetails).to.be.a("string");
        expect(usrDetails.authenticationMethod, usrDetails)
            .to.be.a("string")
            .that.equals("password");
        expect(usrDetails.profile, usrDetails)
            .to.be.an("object")
            .that.has.keys(
                "boardView",
                "templatesBoardId",
                "cardTemplatesSwimlaneId",
                "listTemplatesSwimlaneId",
                "boardTemplatesSwimlaneId"
            );
        expect(usrDetails.emails, usrDetails).to.be.an("array").that.is.not
            .empty;
        expect(usrDetails.username, usrDetails).to.be.a("string").that.is.not
            .empty;
        expect(usrDetails.services, usrDetails)
            .to.be.an("object")
            .that.has.keys("password", "email", "resume");
        expect(usrDetails.createdAt, usrDetails).to.be.a("string").that.is.not
            .empty;
    });
});
