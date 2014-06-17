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
    gcm: {
        sender: '81527757855',
        server_api_key: "WpX4ZIAK11Jg8M9vFrK-ihKR",
        secret: "WpX4ZIAK11Jg8M9vFrK-ihKR"
    },
    token: {
        google_cert: "https://www.googleapis.com/oauth2/v1/certs",
        aud: "81527757855-git6hn59cb7p2dvpbi9t9ijk8f6f32du.apps.googleusercontent.com",
        azp: "81527757855-pa29mpjfectmnhlp8vft7o4ktv8a1uge.apps.googleusercontent.com"
    },
    clientdb: {
        name: "client.sqlite3",
        table_name: "globalNumbers"
    },
    security: {
        server: {
            cert: "content/security/server/cert.pem",
            key: "content/security/server/key.pem"
        }
    },
    criteria: {
        wl: 2,
        bl: 2
    },
    data_path: "content/data/",
    temp_postfix: ".temp",
    gzip_postfix: ".gz",
    system_variables: {
        client_db_version: {
            name: "client_db_version",
            value: 0
        }
    }
};

