import { Request } from "../../request";
import { Controller } from "./controller";
import { Login } from "../models/Login";
import { User } from "../models/User";
import { CookieJar } from "request";

export class Users extends Controller {
    bearerToken: string;

    constructor(BASE_URL?: string, cookieJar?, bearerToken?: string) {
        super(BASE_URL, cookieJar);
        this.bearerToken = bearerToken;
    }

    async createUser(
        email: string,
        password: string,
        username: string
    ): Promise<{ _id: string }> {
        let resp = await new Request<{ _id: string }>(
            this.BASE_URL + "/api/users"
        )
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .method("POST")
            .body({
                email: email,
                password: password,
                username: username
            })
            .send();

        return resp.body;
    }

    async registerUser(email, password): Promise<Login> {
        const resp = await new Request<Login>(this.BASE_URL + "/users/register")
            .cookies(this.cookieJar)
            .method("POST")
            .auth(this.bearerToken)
            .body({
                email: email,
                password: password
            })
            .send();

        return resp.body;
    }

    async login(email: string, password: string): Promise<Login> {
        const resp = await new Request<Login>(this.BASE_URL + "/users/login")
            .cookies(this.cookieJar)
            .method("POST")
            .auth(this.bearerToken)
            .body({
                email: email,
                password: password
            })
            .send();

        return resp.body;
    }

    async userDetailsByID(id: string): Promise<User> {
        const userDetailsResp = await new Request<User>(
            `${this.BASE_URL}/api/users/${id}`
        )
            .auth(this.bearerToken)
            .send();

        return userDetailsResp.body;
    }
}
