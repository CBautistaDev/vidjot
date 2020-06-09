if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://carlos:carlos216@ds251002.mlab.com:51002/vidjot-prod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}