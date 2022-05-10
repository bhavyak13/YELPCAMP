const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const sd = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    // urlNewParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connetion error"));
db.once("open", () => { console.log("Database Connected!"); });


const seedDB = async () => {
    await Campground.deleteMany({});
    // const x=new Campground({title:"My backyard"});
    // await x.save();
    for (let i = 0; i < 500; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const rand2 = Math.floor(Math.random() * sd.descriptors.length);
        const rand3 = Math.floor(Math.random() * sd.places.length);
        const rand4 = Math.floor(Math.random() * 100) + 50;
        const camp = new Campground({
            author: "6224dbb0bbd7361cbf9954f0",
            title: `${sd.descriptors[rand2]} ${sd.places[rand3]}`,
            location: `${cities[rand].city}, ${cities[rand].state}`,
            price: rand4,
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis aliquam vero ipsum impedit consequuntur, repudiandae odit voluptate possimus voluptatem beatae atque provident mollitia aliquid, saepe obcaecati? Tempore blanditiis libero voluptate! Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, saepe iusto. Iure, facere perspiciatis dolore esse repellendus blanditiis reprehenderit dicta omnis explicabo officia nulla adipisci similique, hic repellat culpa itaque?",
            images: [{ "url": "https://res.cloudinary.com/dk4onjyly/image/upload/v1649959333/YelpCamp/v6rwbynes8fqcnxxqnl9.webp", "filename": "YelpCamp/v6rwbynes8fqcnxxqnl9" }, { "url": "https://res.cloudinary.com/dk4onjyly/image/upload/v1649959337/YelpCamp/xgrkqn4rn0fiuvsjyyho.jpg", "filename": "YelpCamp/xgrkqn4rn0fiuvsjyyho" }, { "url": "https://res.cloudinary.com/dk4onjyly/image/upload/v1649959331/YelpCamp/fiilzyrkkfmzmivmpgd6.jpg", "filename": "YelpCamp/fiilzyrkkfmzmivmpgd6" }],
            geometry: { type: "Point", coordinates: [cities[rand].longitude, cities[rand].latitude] },
        })
        await camp.save()
            .then((d) => {
                console.log(d);
            })
            .catch(e => console.log(e));
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})