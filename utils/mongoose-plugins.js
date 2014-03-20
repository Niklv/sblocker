module.exports = {
    timestampsPlugin: function (schema) {
        schema.add({
            createdAt: {type: Number}
        });
        schema.pre('save', function (next) {
            if (!this.createdAt)
                this.createdAt = new Date();
            next();
        });
    }

};
