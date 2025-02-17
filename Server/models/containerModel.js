const mongoose = require('mongoose');

const containerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        variety:{type: String, required: true},
        code:{type: String, required: true},
        description: { type: String, required: true },
        containerreviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Container_Review' }],
        rating: { type: Number, default: 0, required: true, min: 0, max: 5 },
        numReviews: { type: Number, default: 0, required: true },
    },
    {
        timestamps: true
    }
);

const Container = mongoose.model('Container', containerSchema);

module.exports = Container;

