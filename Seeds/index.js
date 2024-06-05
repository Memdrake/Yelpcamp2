const { places, descriptors } = require('./seedHelpers')
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random()*1000);
        /* const placeSeed = Math.floor(Math.random() * places.length); */
        /* const descriptorsSeed = Math.floor(Math.random() * descriptors.length) */
        /* const citySeed = Math.floor(Math.random() * cities.length) */
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //your user id
            author: '66508dcf7722fdd919a18d4e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res-console.cloudinary.com/doluxrdqp/media_explorer_thumbnails/011a4ca3a3bd2f2473969adf7109042e/detailed',
                    filename: 'YelpCamp/w1khzee9jyoeonte06ri',
                }
            ],
            description:
                'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
            price,
            geometry: { 
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ] }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})