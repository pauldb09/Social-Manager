module.exports = {
    mongo: {
        url: "mongodb://localhost:27017/test",
        options: {
            serverSelectionTimeoutMS: 45e3,
            socketTimeoutMS: 4e4,
            keepAlive: !0,
            connectTimeoutMS: 5e4
        },
    },
    token: "",
};