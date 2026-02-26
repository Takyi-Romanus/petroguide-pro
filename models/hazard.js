const mongoose = require('mongoose');

const hazardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  category: {
    type: String,
    enum: ['spill', 'fire', 'explosion', 'gas_leak', 'equipment_failure', 'injury', 'environmental', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['reported', 'investigating', 'resolved'],
    default: 'reported'
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportedByName: String, // for anonymous reports
  images: [String],
  latitude: Number,
  longitude: Number,
  resolution: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hazard', hazardSchema);
