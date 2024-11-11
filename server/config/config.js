const config = {
    production: {
        SERVER: {
            HOST: '0.0.0.0',
            PORT: process.env.PORT || 3000
        },
        DB: {
            URI: process.env.MONGO_URI
        }
    },
    development: {
        SERVER: {
            HOST: 'localhost',
            PORT: 5000
        },
        DB: {
            URI: process.env.MONGO_URI
        }
    }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env]; 