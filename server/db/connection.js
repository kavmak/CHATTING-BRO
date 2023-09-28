const mongoose = require('mongoose');

const url = `mongodb+srv://newuser:ibykaproject@cluster0.df8f08v.mongodb.net/dbName?retryWrites=true&w=majority&appName=AtlasApp`;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to DB')).catch((e) => console.log('Error', e));
