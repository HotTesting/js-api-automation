import { Request } from "../../framework/request";
import * as faker from "faker";
import { expect } from "chai";
import { Users } from "../../framework2/service/controllers/users_controller";

describe("User", function() {
    it("self register should be successful", async function() {
        // Generating random email
        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );

        const resp = await new Users().registerUser(email, email);
        expect(resp, JSON.stringify(resp))
            .to.be.an("object")
            .that.has.all.keys("token", "tokenExpires", "id");
        expect(resp.token, JSON.stringify(resp)).to.be.a("string").that.is.not
            .empty;
        expect(resp.tokenExpires, JSON.stringify(resp)).to.be.a("string").that
            .is.not.empty;
        expect(resp.id, JSON.stringify(resp)).to.be.a("string").that.is.not
            .empty;
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

        expect(createdUser, JSON.stringify(createdUser))
            .to.be.an("object")
            .that.has.key("_id");
        expect(createdUser._id, JSON.stringify(createdUser)).to.be.an("string");
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

        let usrDetails = await adminUsersController.userDetailsByID(
            loggedInModel.id
        );

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
        expect(usrDetails._id, JSON.stringify(usrDetails)).to.be.a("string");
        expect(usrDetails.authenticationMethod, JSON.stringify(usrDetails))
            .to.be.a("string")
            .that.equals("password");
        expect(usrDetails.profile, JSON.stringify(usrDetails))
            .to.be.an("object")
            .that.has.keys(
                "boardView",
                "templatesBoardId",
                "cardTemplatesSwimlaneId",
                "listTemplatesSwimlaneId",
                "boardTemplatesSwimlaneId"
            );
        expect(usrDetails.emails, JSON.stringify(usrDetails)).to.be.an("array")
            .that.is.not.empty;
        expect(usrDetails.username, JSON.stringify(usrDetails)).to.be.a(
            "string"
        ).that.is.not.empty;
        expect(usrDetails.services, JSON.stringify(usrDetails))
            .to.be.an("object")
            .that.has.keys("password", "email", "resume");
        expect(usrDetails.createdAt, JSON.stringify(usrDetails)).to.be.a(
            "string"
        ).that.is.not.empty;
    });
});
