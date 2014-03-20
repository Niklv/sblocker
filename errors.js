var errors = {
    0: "unknown error",
    1: "number is not provided",
    2: "phone format error",
    3: "DB error",
    4: "dublicate detected",
    5: "code is not provided",
    6: "code format error",
    7: "wrong code",
    8: "empty blacklist item",
    total: 8
};


module.exports = function (code, desc, toLog) {
    if (typeof code === "undefined") code = 0;
    if (typeof toLog === "undefined") toLog = false;
    var err = {
        err_code: code,
        err: errors[code <= errors.total ? code : 0]
    };
    if (desc)
        err.additional_info = desc;
    return err;
};
