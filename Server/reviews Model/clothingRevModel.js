// models/reviewModel.js

const mongoose = require('mongoose');

const clothingSchema = new mongoose.Schema({
    
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },  // Ensure rating is a number
    comment: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Clothing' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});

const Clothing_Review = mongoose.model('Clothing_Review', clothingSchema);

module.exports = Clothing_Review;
