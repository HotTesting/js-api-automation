const axios = require("axios");

exports.getMeDogs = function(endpoint) {
    const url = endpoint.url;
    const port = endpoint.port;

    return axios.request({
        method: "GET",
        baseURL: `${url}:${port}`,
        url: "/dogs",
        headers: { Accept: "application/json" }
    });
};

exports.getMeDog = function(endpoint) {
    const url = endpoint.url;
    const port = endpoint.port;

    return axios.request({
        method: "GET",
        baseURL: `${url}:${port}`,
        url: "/dogs/1",
        headers: { Accept: "application/json" }
    });
};
