module.exports = {
    number: {
        type: String,
        require: true,
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
