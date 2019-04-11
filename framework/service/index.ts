import { CookieJar } from "request";
import * as request from "request-promise-native";
import { Users } from "./controllers/users_controller";

export class API {
    readonly API_BASE_URL: string;
    readonly users: Users;
    cookieJar: CookieJar;

    constructor(API_BASE_URL: string, cookieJar: CookieJar = request.jar()) {
        this.API_BASE_URL = API_BASE_URL;
        this.cookieJar = cookieJar;
        this.users = new Users(this.API_BASE_URL, this.cookieJar);
    }
}
