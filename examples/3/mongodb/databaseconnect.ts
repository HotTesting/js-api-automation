import * as mongoose from "mongoose";
import { Request } from "../../../framework/request";
import * as faker from "faker";
import { expect } from "chai";

async function promoteUserToAdmin(id: string) {
    await mongoose.connect("mongodb://localhost/admin", {
        useNewUrlParser: true
    });
    let users = mongoose.connection.collection("users");
    console.log("connected");

    // Query
    let result = await users.findOne({ _id: id });
    console.log(result);
    users.find
    users.findOneAndUpdate({ _id: id }, { $set: { isAdmin: true } });
    await mongoose.connection.close();
}

describe("Admin", function() {
    it("promotion", async function() {
        // Generating random email
        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );
        console.log('EMAIL', email)
        const resp = await new Request("http://localhost:8080/users/register")
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

        await promoteUserToAdmin(resp.body.id);
    });
});
