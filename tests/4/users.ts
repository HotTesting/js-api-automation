import * as faker from "faker";
import { expect } from "chai";
import { Users } from "../../framework3/service/controllers/users_controller";

describe("User", function() {
    it("self register should be successful", async function() {
        // Generating random email
        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );

        const resp = await new Users().registerUser(email, email);
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
    });
});
