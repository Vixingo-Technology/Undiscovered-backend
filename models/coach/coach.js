const mongoose = require('mongoose');

const coachSchema = mongoose.Schema({
  personalInformation: {
    firstName: { type: String, },
    lastName: { type: String, },
    schoolCollege: { type: String },
    position: { type: String, },
    teamName: { type: String, },
    conference: { type: String, },
  },
  contactDetail: {
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },

    },
    email: { type: String },
    twitterLink: { type: String },
    instagramLink: { type: String },
    linkedinLink: { type: String },
  },
  coachingExperience: {
    yearsOfExperience: { type: Number },
    previousTeams: [
      {
        teamName: { type: String },
        coachPosition: { type: String },
        yearsCoached: { type: Number },
      },
    ],
  },
  recruitmentPreference: {
    positionsRecruitingFor: [String],
    playerCharacteristics: [String],
    academicRequirements: [String],
  },
  teamAccomplishments: [String],
  philosophyPlayingStyle: [String],
  additionalInformation: {
    recruitmentCalendar: { type: String },
    tryouts: { type: String },
    officialVisits: { type: String },
    signingDay: { type: String },
    programHighlights: { type: String },
    contactPreferences: { type: String },
  },
  auth: {
    type: mongoose.Schema.ObjectId,
    ref: 'auth',
  },
  type: {
    type: String,
  },
});

const coachmodel = mongoose.model('coach', coachSchema);
module.exports = coachmodel;
