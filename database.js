const mongoose = require('mongoose');

class DataBase {
    constructor() {
        this.connect()
    }

    connect() {
        mongoose.connect('mongodb+srv://appuser:TomBrady12@twitter-clone.d2gti.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: false
        })
        .then(() => {
            console.log('You have connected to the database');
        })
        .catch((err) => {
            console.log("Failed to connect to the database: " + err);
        })
    }


}

module.exports = new DataBase();