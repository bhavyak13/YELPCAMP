const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String,
})
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('upload', 'upload/w_200')
})



const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    review: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
}, opts);

campgroundSchema.virtual('properties.popupText').get(function () {
    return `<a href='/campgrounds/${this.id}'><strong>${this.title}</strong></a>
    <p>${this.description.substring(0,20)}...</p>`
})

module.exports = mongoose.model('Campground', campgroundSchema);
