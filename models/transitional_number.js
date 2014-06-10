module.exports = {
    number: {
        type: String,
        require: true,
        empty: false,
        index: { unique: true }
    },
    occurrence: {
        type: Number,
        require: true,
        default: 1,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
};
