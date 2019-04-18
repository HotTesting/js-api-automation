import * as faker from "faker";
import * as chai from "chai";
import { Users } from "../../framework2/service/controllers/users_controller";
chai.use(require("chai-json-schema-ajv"));
const expect = chai.expect;

const tokensSchema = {
    type: "object",
    properties: {
        token: {
            type: "string"
        },
        tokenExpires: {
            type: "string"
        },
        id: {
            type: "string"
        }
    }
};

describe("User", function() {
    it("self register should be successful", async function() {
        // Generating random email
        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );
        const resp = await new Users().registerUser(email, email);
        expect(resp).to.be.jsonSchema(tokensSchema);
    });

    it("creating new user should be successful", async function() {
        const loggedInModel = await new Users().login(
            "test@test.com",
            "123456"
        );

        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );
        // console.log(loggedInModel);
        const adminUsersController = new Users(
            undefined,
            undefined,
            loggedInModel.token
        );

        const createdUser = await adminUsersController.createUser(
            email,
            email,
            faker.internet.userName()
        );

        expect(createdUser).to.be.jsonSchema({
            type: "object",
            properties: {
                _id: {
                    type: "string"
                }
            }
        });
    });

    it("receiving information about user by id should be successful", async function() {
        // login as admin
        const loggedInModel = await new Users().login(
            "test@test.com",
            "123456"
        );
        const adminUsersController = new Users(
            undefined,
            undefined,
            loggedInModel.token
        );
        const usrDetails = await adminUsersController.userDetailsByID(
            loggedInModel.id
        );
        let usrDetailsSchema = require('../../raml/user.json')
        expect(usrDetails).to.be.jsonSchema(usrDetailsSchema);
    });
});
