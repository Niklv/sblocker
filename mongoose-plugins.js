module.exports = {
    timestampsPlugin: function (schema) {
        schema.add({
            createdAt: {type: Number}
        });
        schema.pre('save', function (next) {
            if (!this.at)
                this.at = new Date().getTime();
            next();
        });
    }

};
