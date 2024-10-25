const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let authSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'subscriptions',
    },
    role: {
      type: String,
    },
    is_profile_complete: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

let authmodel = mongoose.model('auth', authSchema);

module.exports = authmodel;
