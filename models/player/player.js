const mongoose = require('mongoose');

const playerSchema = mongoose.Schema(
  {
    auth: {
      type: mongoose.Schema.ObjectId,
      ref: 'auth',
    },
    starRating: {
      type: Number,
    },

    isRequested: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: String,
      default:
        'https://images.stockcake.com/public/d/7/8/d78cebaa-ab71-4582-a26f-5481a0cd71a4_large/intense-basketball-play-stockcake.jpg',
    },

    institute: {
      type: mongoose.Schema.ObjectId,
      ref: 'university',
    },
    location: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    jerseyNumber: {
      type: Number,
      required: true,
    },
    birthPlace: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
    },
    favouriteBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'auth',
      },
    ],
    status: {
      type: String,
      default: 'pending',
    },
    previousCoachName: {
      type: String,
    },
    followedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'auth',
      },
    ],
    article: {
      type: String,
    },
    video1_title: {
      type: String
    },
    video1_description: {
      type: String
    },
    video1: {
      type: String,
      validate: {
        validator: function (v) {
          // Simple URL validation regex
          return /^(https?:\/\/[^\s]+)/.test(v);
        },
        message: 'Invalid URL format for video1.',
      },
    },
    video2_title: {
      type: String
    },
    video2_description: {
      type: String
    },
    video2: {
      type: String,
      validate: {
        validator: function (v) {
          // Simple URL validation regex
          return /^(https?:\/\/[^\s]+)/.test(v);
        },
        message: 'Invalid URL format for video2.',
      },
    },
    video3_title: {
      type: String
    },
    video3_description: {
      type: String
    },
    video3: {
      type: String,
      validate: {
        validator: function (v) {
          // Simple URL validation regex
          return /^(https?:\/\/[^\s]+)/.test(v);
        },
        message: 'Invalid URL format for video3.',
      },
    },
    video4_title: {
      type: String
    },
    playerUpdateFields: {
      type: Number,
      default: 3
    },
    video4_description: {
      type: String
    },
    video4: {
      type: String,
      validate: {
        validator: function (v) {
          // Simple URL validation regex
          return /^(https?:\/\/[^\s]+)/.test(v);
        },
        message: 'Invalid URL format for video4.',
      },

    },

    upload_video: {
      type: String
    },
    upload_video_link: {
      type: String
    },
    upload_title: {
      type: String
    },
    upload_description: {
      type: String
    },
    embedded_video: {
      type: String
    },
    embedded_video_link: {
      type: String
    },
    embedded_title: {
      type: String
    },
    embedded_description: {
      type: String
    },
    strengths: {
      type: String,
      default: ""
    },
    weaknesses: {
      type: String,
      default: ""
    },
    is_shown: {
      type: Number,
      enum: [0, 1],
      default: 0

    },
  },
  { timestamps: true }
);

const playerModel = mongoose.model('player', playerSchema);
module.exports = playerModel;
