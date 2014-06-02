module.exports = {
    http: {
        port: 20303
    },
    https: {
        port: 20302
    },
    mongo: {
        user: "developer",
        pwd: "fwaocbnw3rwctn38ctfgw38x4nt0crtfnzxmg4t30nwct043",
        url: "37.139.15.10:27017",
        db: "sblocker"
    },
    token: {
        google_cert: "https://www.googleapis.com/oauth2/v1/certs",
        aud: "",
        azp: "81527757855-pa29mpjfectmnhlp8vft7o4ktv8a1uge.apps.googleusercontent.com"
    },
    clientdb: {
        name: "client.sqlite3"
    },
    security: {
        server: {
            cert: "content/security/server/cert.pem",
            key: "content/security/server/key.pem"
        }
    },
    data_path: "content/data/",
    temp_postfix: ".temp",
    gzip_postfix: ".gz"
};

