// models/reviewModel.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },  // Ensure rating is a number
    comment: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'FrostedMug' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});

const Frostedmug_Review = mongoose.model('Frostedmug_Review', reviewSchema);

module.exports = Frostedmug_Review;
