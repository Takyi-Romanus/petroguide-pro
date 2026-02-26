const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['drilling', 'reservoir', 'production', 'safety', 'environment', 'digital'],
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: { type: Number, default: 30 }, // minutes
  content: [{
    type: { type: String, enum: ['text', 'video', 'quiz'], default: 'text' },
    title: String,
    body: String,
    videoUrl: String,
    questions: [{
      question: String,
      options: [String],
      correct: Number
    }]
  }],
  thumbnail: { type: String, default: '/images/default-module.jpg' },
  tags: [String],
  enrolledCount: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Module', moduleSchema);
