const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract'],
    default: 'full-time'
  },
  category: {
    type: String,
    enum: ['drilling', 'reservoir', 'production', 'safety', 'environment', 'data', 'management'],
    required: true
  },
  description: { type: String, required: true },
  requirements: [String],
  benefits: [String],
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'GHS' }
  },
  deadline: Date,
  applyLink: String,
  logo: String,
  isActive: { type: Boolean, default: true },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Career', careerSchema);
