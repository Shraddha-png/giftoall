
const mongoose = require('mongoose');

const girls_tshirtsSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        category: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        variety:{type: String, required: true},
        code:{type: String, required: true},
        description: { type: String, required: true },
        girlstshirtreviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Girls_tshirt_Review' }],
        rating: { type: Number, default: 0, required: true, min: 0, max: 5 },
        numReviews: { type: Number, default: 0, required: true },
       
        
    },
    {
        timestamps: true
    }
);

const Girls_tshirt= mongoose.model('Girls_tshirt', girls_tshirtsSchema);

module.exports = Girls_tshirt;
