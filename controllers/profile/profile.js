const profileModel = require('../../models/profile/profile');
const universityModel = require('../../models/university/university');
const playerModel = require('../../models/player/player');
const videoModel = require('../../models/video/video');
const newsFeedModel = require('../../models/news feed/newsFeed');
const { cloudinaryUpload } = require('../../utils/cloudinary');
const mailgun = require('mailgun.js');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const mailmodel = require('../../models/mail/mail');
const coachModel = require('../../models/coach/coach');
const contactusmodel = require('../../models/contactus/contactus');
const authmodel = require('../../models/auth/auth');
const testimonialmodel = require('../../models/testimonial/testimonial');
const { listen } = require('express/lib/application');
const axios = require('axios');


// module.exports.createProfile = async (req, res) => {
//     let { about, phoneNumber,jerseyNumber,birthPlace, starRating, athleticaccomplishments, name, location, position, height, weight, offers, coach, socialLinks, stats, academics, playerClass, universityName } = req.body;

//     const images = req.files['images'] || [];
//     const logos=req.files['logo']
//     let imagesUrls = [];
//     let logoUrls=[]
//     if (images.length > 0) {
//         const imagesPath = "/tmp/public/files/images"
//         let imagesFiles = images.map((val) => path.join(imagesPath, val.originalname));
//         let logoFiles=logos.map((val)=>path.join(imagesPath,val.originalname))
//         if (!fs.existsSync(imagesPath)) {
//             fs.mkdirSync(imagesPath);
//         }

//         logos.forEach((val,i)=>{
//           fs.writeFileSync(logoFiles[i],val.buffer)
//         })
//         images.forEach((val, i) => {
//             fs.writeFileSync(imagesFiles[i], val.buffer);
//         });

//         const imageUploadPromises = imagesFiles.map((file) => cloudinaryUpload(file));
//         const logoUploadPromises=logoFiles.map((file)=>cloudinaryUpload(file))

//         const imageUploads = await Promise.all(imageUploadPromises);
//         const logoUploads = await Promise.all(logoUploadPromises);
//         imagesUrls = imageUploads.map((upload) => upload.url);
//         logoUrls=logoUploads.map((upload)=>upload.url)
//         images.forEach((val, i) => {
//             fs.unlinkSync(imagesFiles[i], val.buffer);
//         });
//     }

//     const picture = req.files['picture'] || null;
//     let pictureUrl = null;
//     if (picture) {
//         const photosDir = "/tmp/public/files/photos"
//         const originalPhotoName = picture[0].originalname;
//         const photofileName = `${Date.now()}-${originalPhotoName}`;
//         const photofile = path.join(photosDir, photofileName);

//         if (!fs.existsSync(photosDir)) {
//             fs.mkdirSync(photosDir);
//         }

//         fs.writeFileSync(photofile, picture[0].buffer);

//         const photoUpload = await cloudinaryUpload(photofile);
//         pictureUrl = photoUpload.url;
//         fs.unlinkSync(photofile)
//     }

//     try {
//         // Convert academics string to JSON object
//         academics = JSON.parse(academics);

//         // Convert offers string to JSON array
//         offers = JSON.parse(offers);
//         offers = offers.map((offer, index) => ({
//           ...offer,
//           logo: logoUrls[index] || null
//       }));
//         // Assuming universityName is used to create a university first
//         const university = await universityModel.create({
//             universityName
//         });

//         try {
//             // Create player using the created university's _id
//             const player = await playerModel.create({
//                 auth: req.user._id,
//                 picture: pictureUrl,
//                 name,
//                 location,
//                 position,
//                 height,
//                 weight,
//                 institute: university._id, // use university._id because create() expects an array
//                 class: playerClass,
//                 jerseyNumber,
//                 birthPlace
//             });

//             try {
//                 // Create profile linked to the created player
//                 const profile = await profileModel.create({
//                     auth: req.user._id,
//                     about,
//                     player: player._id,
//                     phoneNumber,
//                     starRating,
//                     athleticaccomplishments,
//                     socialLinks,
//                     stats,
//                     coach,
//                     offers,
//                     academics,
//                     photos: imagesUrls,
//                 });

//                 return res.status(200).json({
//                     message: 'Profile created successfully',
//                 });
//             } catch (profileError) {
//                 // Delete player and university if creating profile fails
//                 await playerModel.findByIdAndDelete(player._id);
//                 await universityModel.findByIdAndDelete(university._id);
//                 console.error(profileError.message);
//                 return res.status(500).json({
//                     error: 'Server error. Please retry.'
//                 });
//             }
//         } catch (playerError) {
//             // Delete university if creating player fails
//             await universityModel.findByIdAndDelete(university._id);
//             console.error(playerError.message);
//             return res.status(500).json({
//                 error: 'Server error. Please retry.'
//             });
//         }
//     } catch (universityError) {
//         console.error(universityError.message);
//         return res.status(500).json({
//             error: 'Server error. Please retry.'
//         });
//     }
// };

module.exports.updateStatus = async (req, res) => {
  let { status, id } = req.body;
  try {
    await playerModel.updateOne({ _id: id }, { $set: { status } });
    return res.status(200).json({
      messages: 'SUCESS',
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Server error please try again',
    });
  }
};
// old code
// module.exports.createProfile = async (req, res) => {
//   try {
//     let {
//       about,
//       phoneNumber,
//       jerseyNumber,
//       birthPlace,
//       starRating,
//       athleticaccomplishments,
//       name,
//       location,
//       position,
//       height,
//       weight,
//       offers,
//       coach,
//       socialLinks,
//       stats,
//       academics,
//       playerClass,
//       universityName,
//       videoLinks: links,
//     } = req.body;

//     let videos = req.files['videos'] || [];

//     // Parse offers
//     let offerid = [];
//     try {
//       offers = JSON.parse(offers);
//       offers.forEach((val) => {
//         if (val?.logoid !== undefined) {
//           offerid.push(val.logoid);
//         }
//       });
//     } catch (error) {
//       console.error('Failed to parse offers:', error);
//       return res.status(400).json({ error: 'Invalid offers format' });
//     }

//     const images = req.files['images'] || [];
//     let imagesUrls = [];

//     coach = coach?.length > 0 ? JSON.parse(coach) : ``;
//     if (images.length > 0) {
//       const imagesPath = '/tmp/public/files/images';
//       const files = [...images];
//       let filesPaths = files.map((val) =>
//         path.join(imagesPath, val.originalname)
//       );

//       if (!fs.existsSync(imagesPath)) {
//         fs.mkdirSync(imagesPath, { recursive: true });
//       }

//       files.forEach((val, i) => {
//         fs.writeFileSync(filesPaths[i], val.buffer);
//       });

//       const imageUploadPromises = images.map((file) =>
//         cloudinaryUpload(path.join(imagesPath, file.originalname))
//       );

//       const imageUploads = await Promise.all(imageUploadPromises);

//       imagesUrls = imageUploads.map((upload) => upload.url);
//     }

//     const picture = req.files['picture'] || null;
//     let pictureUrl = null;
//     if (picture) {
//       const photosDir = '/tmp/public/files/photos';
//       const photofileName = `${Date.now()}-${picture[0].originalname}`;
//       const photofile = path.join(photosDir, photofileName);

//       if (!fs.existsSync(photosDir)) {
//         fs.mkdirSync(photosDir, { recursive: true });
//       }

//       fs.writeFileSync(photofile, picture[0].buffer);
//       const photoUpload = await cloudinaryUpload(photofile);
//       pictureUrl = photoUpload.url;
//     }

//     try {
//       // Ensure academics, offers, socialLinks, and stats are objects
//       academics = academics ? (typeof academics === 'string' ? JSON.parse(academics) : academics) : {};
//       offers = offers ? (typeof offers === 'string' ? JSON.parse(offers) : offers) : [];
//       socialLinks = socialLinks ? (typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks) : [];
//       stats = stats ? (typeof stats === 'string' ? JSON.parse(stats) : stats) : {};

//       let profile = await profileModel.findOne({ auth: req.user._id }).populate('player');
//       const videoIds = await uploadVideos(videos, req.user._id, links);

//       let video_id
//       if (videoIds.length > 0) {
//         videoIds.map(item => {
//           video_id = item._id
//         })
//       }

//       if (profile) {
//         if (universityName) {
//           await universityModel.updateOne({ _id: profile.player.institute }, { $set: { universityName } });
//         }

//         const playerUpdateFields = {
//           name,
//           location,
//           position,
//           height,
//           weight,
//           class: playerClass,
//           jerseyNumber,
//           birthPlace,
//           picture: pictureUrl,
//         };

//         await playerModel.updateOne({ _id: profile.player._id }, { $set: playerUpdateFields });

//         const profileUpdateFields = {
//           about,
//           phoneNumber,
//           starRating,
//           athleticaccomplishments,
//           stats,
//           offers,
//           academics,
//           photos: imagesUrls,
//           videos: video_id // Add the video IDs to the profile
//         };

//         if (coach) {
//           const existingCoaches = await coachModel.find({ auth: req.user._id });
//           let coachData = {};
//           if (coach.name) coachData.name = coach.name;
//           if (coach.phoneNumber) coachData.phone = coach.phoneNumber;
//           if (coach.email) coachData.email = coach.email;
//           if (coach.role) coachData.coachProgram = coach.role;
//           if (coach.type) coachData.type = coach.type;

//           await coachModel.updateOne({ auth: req.user._id }, { $set: coachData });
//         }

//         if (socialLinks && socialLinks.length > 0) {
//           let updatedSocialLinks = profile.socialLinks.map((currentLink) => {
//             const newLink = socialLinks.find(link => link.social_type === currentLink.social_type);
//             return newLink ? { ...currentLink, link: newLink.link || currentLink.link } : currentLink;
//           });

//           socialLinks.forEach(newLink => {
//             if (!updatedSocialLinks.some(link => link.social_type === newLink.social_type)) {
//               updatedSocialLinks.push(newLink);
//             }
//           });

//           profileUpdateFields.socialLinks = updatedSocialLinks;
//         }

//         await profileModel.updateOne({ auth: req.user._id }, { $set: profileUpdateFields });

//         return res.status(200).json({
//           message: 'Profile updated successfully',
//         });
//       } else {
//         const university = await universityModel.create({ universityName });

//         try {
//           const player = await playerModel.create({
//             auth: req.user._id,
//             picture: pictureUrl,
//             name,
//             location,
//             position,
//             height,
//             weight,
//             institute: university._id,
//             class: playerClass,
//             jerseyNumber,
//             birthPlace,
//           });

//           try {
//             let coachfinal = await coachModel.create({
//               coachProgram: coach.role,
//               name: coach.name,
//               phone: coach.phoneNumber,
//               email: coach.email,
//               auth: req.user._id,
//               type: coach?.type,
//             });

//             profile = await profileModel.create({
//               auth: req.user._id,
//               about,
//               player: player._id,
//               phoneNumber,
//               starRating,
//               athleticaccomplishments,
//               socialLinks,
//               stats,
//               coach: coachfinal._id,
//               offers,
//               academics,
//               photos: imagesUrls,
//               videos: video_id, // Add the video IDs to the profile
//             });

//             return res.status(200).json({
//               message: 'Profile created successfully',
//             });
//           } catch (profileError) {
//             await playerModel.findByIdAndDelete(player._id);
//             await universityModel.findByIdAndDelete(university._id);
//             console.error(profileError.message);
//             return res.status(500).json({
//               error: 'Server error. Please retry.',
//             });
//           }
//         } catch (playerError) {
//           await universityModel.findByIdAndDelete(university._id);
//           console.error(playerError.message);
//           return res.status(500).json({
//             error: 'Server error. Please retry.',
//           });
//         }
//       }
//     } catch (error) {
//       return res.status(400).json({
//         error: 'Invalid data format',
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       error: 'Server error. Please retry.',
//     });
//   }
// };

const uploadVideos = async (videos, featuredPlayer, links = []) => {
  if (!videos || videos.length === 0) {
    return []; // Return an empty array if no videos are uploaded
  }

  const videoDir = '/tmp/public/files/videos';
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const results = [];
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];

    try {
      let filename = `${Date.now()}-${video.originalname}`;
      let finalname = path.join(videoDir, filename);

      fs.writeFileSync(finalname, video.buffer);

      let videoUrl = await cloudinaryUpload(finalname);

      console.log('Uploaded video URL:', videoUrl.url);

      fs.unlinkSync(finalname);

      let videoEntry = await videoModel.create({
        title: 'Video added by Player',
        description: 'Video added by Player',
        featuredPlayer,
        video: videoUrl.url,
      });

      results.push(videoEntry);
    } catch (error) {
      console.error(`Failed to upload video ${video.originalname}`, error);
      results.push({ error: `Failed to upload video ${video.originalname}` });
    }
  }

  // Handle video links (if any)
  if (Array.isArray(links) && links.length > 0) {
    for (let i = 0; i < links.length; i++) {
      const video = links[i];

      let videoEntry = await videoModel.create({
        title: 'Video added by Player',
        description: 'Video added by Player',
        featuredPlayer,
        video: video,
      });

      results.push(videoEntry);
    }
  }

  return results;
};

// new code 
module.exports.createProfile = async (req, res) => {
  try {
    let {
      video1_title,
      video1_description,
      video2_title,
      video2_description,
      video3_title,
      video3_description,
      video4_title,
      video4_description,
      about,
      phoneNumber,
      jerseyNumber,
      birthPlace,
      starRating,
      athleticaccomplishments,
      name,
      location,
      position,
      height,
      weight,
      offers,
      coach,
      socialLinks,
      stats,
      academics,
      playerClass,
      universityName,
      videoLinks: links,
      embed_links,
    } = req.body;

    let videos = req.files['videos'] || [];
    console.log("files", req.files);

    // Ensure embed_links is an array and not null/undefined
    embed_links = embed_links ? (typeof embed_links === 'string' ? JSON.parse(embed_links) : embed_links) : [];

    // Parse offers
    let offerid = [];
    try {
      offers = JSON.parse(offers);
      offers.forEach((val) => {
        if (val?.logoid !== undefined) {
          offerid.push(val.logoid);
        }
      });
    } catch (error) {
      console.error('Failed to parse offers:', error);
      return res.status(400).json({ error: 'Invalid offers format' });
    }

    // Process Images
    const images = req.files['images'] || [];
    let imagesUrls = [];

    try {
      if (images.length > 0) {
        const imagesPath = '/tmp/public/files/images';
        const files = [...images];
        const filesPaths = files.map((val) =>
          path.join(imagesPath, val.originalname)
        );

        if (!fs.existsSync(imagesPath)) {
          fs.mkdirSync(imagesPath, { recursive: true });
        }

        files.forEach((val, i) => {
          fs.writeFileSync(filesPaths[i], val.buffer);
        });

        const imageUploadPromises = filesPaths.map((filePath) =>
          cloudinaryUpload(filePath)
        );

        const imageUploads = await Promise.all(imageUploadPromises);

        imagesUrls = imageUploads.map((upload) => upload.url);

        // Clean up the local files after uploading to Cloudinary
        filesPaths.forEach((filePath) => fs.unlinkSync(filePath));
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      return res.status(500).json({
        error: 'Failed to upload images',
      });
    }

    // Process Profile Picture
    const picture = req.files['picture'] || null;
    let pictureUrl = null;

    try {
      if (picture) {
        const photosDir = '/tmp/public/files/photos';
        const photofileName = `${Date.now()}-${picture[0].originalname}`;
        const photofile = path.join(photosDir, photofileName);

        if (!fs.existsSync(photosDir)) {
          fs.mkdirSync(photosDir, { recursive: true });
        }

        fs.writeFileSync(photofile, picture[0].buffer);
        const photoUpload = await cloudinaryUpload(photofile);
        pictureUrl = photoUpload.url;

        // Clean up the local file after uploading to Cloudinary
        fs.unlinkSync(photofile);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return res.status(500).json({
        error: 'Failed to upload profile picture',
      });
    }

    try {
      academics = academics ? (typeof academics === 'string' ? JSON.parse(academics) : academics) : {};
      offers = offers ? (typeof offers === 'string' ? JSON.parse(offers) : offers) : [];
      socialLinks = socialLinks ? (typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks) : [];
      stats = stats ? (typeof stats === 'string' ? JSON.parse(stats) : stats) : {};

      let profile = await profileModel.findOne({ auth: req.user._id }).populate('player');
      const videoIds = await uploadVideos(videos, req.user._id, links);

      let video_id = [];
      if (videoIds.length > 0) {
        video_id = videoIds.map(item => item._id);
      }

      if (profile && profile.player) {
        if (universityName) {
          await universityModel.updateOne({ _id: profile.player.institute }, { $set: { universityName } });
        }

        const playerUpdateFields = {
          video1_title,
          video1_description,
          video2_title,
          video2_description,
          video3_title,
          video3_description,
          video4_title,
          video4_description,
          name,
          location,
          position,
          height,
          weight,
          class: playerClass,
          jerseyNumber,
          birthPlace,
          picture: pictureUrl,
          status: "pending"
        };

        await playerModel.updateOne({ _id: profile.player._id }, { $set: playerUpdateFields });
        await authmodel.findOneAndUpdate({ _id: req.user._id }, {
          name: name
        })

        const profileUpdateFields = {
          about,
          phoneNumber,
          starRating,
          athleticaccomplishments,
          stats,
          offers,
          academics,
          photos: imagesUrls,
          videos: video_id, // Add the video IDs to the profile
          embed_links,      // Add embed_links to the profile
          name: name
        };

        if (coach) {
          const existingCoaches = await coachModel.find({ auth: req.user._id });
          let coachData = {};
          if (coach.name) coachData.name = coach.name;
          if (coach.phoneNumber) coachData.phone = coach.phoneNumber;
          if (coach.email) coachData.email = coach.email;
          if (coach.role) coachData.coachProgram = coach.role;
          if (coach.type) coachData.type = coach.type;

          await coachModel.updateOne({ auth: req.user._id }, { $set: coachData });
        }

        if (socialLinks && socialLinks.length > 0) {
          // Filter out null or undefined values from socialLinks
          socialLinks = socialLinks.filter(link => link && typeof link.social_type !== 'undefined');

          let updatedSocialLinks = profile.socialLinks.map((currentLink) => {
            const newLink = socialLinks.find(link => link.social_type === currentLink.social_type);
            return newLink ? { ...currentLink, link: newLink.link || currentLink.link } : currentLink;
          });

          socialLinks.forEach(newLink => {
            if (!updatedSocialLinks.some(link => link.social_type === newLink.social_type)) {
              updatedSocialLinks.push(newLink);
            }
          });

          profileUpdateFields.socialLinks = updatedSocialLinks;

        }

        await profileModel.updateOne({ auth: req.user._id }, { $set: profileUpdateFields });

        return res.status(200).json({
          message: 'Profile updated successfully',
        });
      } else {
        const university = await universityModel.create({ universityName });

        try {
          const player = await playerModel.create({
            auth: req.user._id,
            picture: pictureUrl,
            name,
            location,
            position,
            height,
            weight,
            institute: university._id,
            class: playerClass,
            jerseyNumber,
            birthPlace,
            status: "pending"

          });

          try {
            let coachfinal = await coachModel.create({
              coachProgram: coach.role,
              name: coach.name,
              phone: coach.phoneNumber,
              email: coach.email,
              auth: req.user._id,
              type: coach?.type,
            });

            profile = await profileModel.create({
              auth: req.user._id,
              about,
              player: player._id,
              phoneNumber,
              starRating,
              athleticaccomplishments,
              socialLinks,
              stats,
              coach: coachfinal._id,
              offers,
              academics,
              photos: imagesUrls,
              videos: video_id,  // Add the video IDs to the profile
              embed_links,       // Add embed_links during profile creation
            });

            const data = await authmodel.findByIdAndUpdate(req.user._id, {
              is_profile_complete: true
            }, { new: true });

            return res.status(200).json({
              message: 'Profile created successfully', is_profile_complete: data.is_profile_complete,
            });
          } catch (profileError) {
            await playerModel.findByIdAndDelete(player._id);
            await universityModel.findByIdAndDelete(university._id);
            console.error(profileError.message);
            return res.status(500).json({
              error: 'Server error. Please retry.',
            });
          }
        } catch (playerError) {
          await universityModel.findByIdAndDelete(university._id);
          console.error(playerError.message);
          return res.status(500).json({
            error: 'Server error. Please retry.',
          });
        }
      }
    } catch (error) {
      console.log("error", error);
      return res.status(400).json({
        error: 'Invalid data format',
      });
    }
  } catch (error) {
    console.log("error", error);

    return res.status(500).json({
      error: 'Server error. Please retry.',
    });
  }
};

module.exports.getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch profile with all necessary populated fields
    let profilePromise = await profileModel
      .findOne({ auth: id })
      .populate({
        path: 'player',
        populate: {
          path: 'institute',
          model: 'university',
        },
      })
      .populate('auth')
      .populate('coach');

    // Fetch players associated with the profile's auth
    let playersPromise = playerModel
      .find({ auth: id })
      .populate('institute')
      .populate('auth');

    // Fetch other players excluding the current profile's auth
    let showPlayersPromise = playerModel
      .find({ auth: { $ne: id } })
      .populate('institute')
      .populate('auth');

    // Fetch videos featuring the current profile
    let videoDataPromise = videoModel.find({ featuredPlayer: id });

    // Fetch news feed data filtering by featured players including the current profile
    let newsFeedDataPromise = newsFeedModel.find({ featuredPlayers: id });

    // Wait for all promises to resolve
    let [profile, players, showPlayers, videoData, newsFeedData] =
      await Promise.all([
        profilePromise,
        playersPromise,
        showPlayersPromise,
        videoDataPromise,
        newsFeedDataPromise,
      ]);

    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
      });
    }

    // Calculate career stats
    let careerStats = {
      stats: 'career',
      gp: profile.stats.length || 0,
      fg: 0,
      threep: 0,
      ft: 0,
      reb: 0,
      ast: 0,
      blk: 0,
      stl: 0,
      pf: 0,
      to: 0,
      pts: 0,
    };

    // Aggregate stats
    if (profile.stats.length === 0) {
      careerStats.stats.gp = 0;
      careerStats.stats.fg = 0;
      careerStats.stats.threep = 0;
      careerStats.stats.ft = 0;
      careerStats.stats.reb = 0;
      careerStats.stats.ast = 0;
      careerStats.stats.blk = 0;
      careerStats.stats.stl = 0;
      careerStats.stats.pf = 0;
      careerStats.stats.to = 0;
      careerStats.stats.pts = 0;
    } else {
      console.log(profile.stats);
      // Object.entries(profile.stats).forEach(([key, stat]) => {
      //   careerStats.gp++;
      //   careerStats.fg += profile.stats[key]?.fg || 0;
      //   careerStats.threep += profile.stats[key]?.threep || 0;
      //   careerStats.ft += profile.stats[key]?.ft || 0;
      //   careerStats.stats.reb += stat?.reb || 0;
      //   careerStats.stats.ast += stat?.ast || 0;
      //   careerStats.stats.blk += stat?.blk || 0;
      //   careerStats.stats.stl += stat?.stl || 0;
      //   careerStats.stats.pf += stat?.pf || 0;
      //   careerStats.stats.to += stat?.to || 0;
      //   careerStats.stats.pts += stat?.pts || 0;
      // });
      careerStats = {
        stats: 'career',
        gp: Number(profile.stats.gp) || 0,
        fg: Number(profile.stats.fg) || 0,
        threep: Number(profile.stats.threep),
        ft: Number(profile.stats.ft) || 0,
        reb: Number(profile.stats.reb) || 0,
        ast: Number(profile.stats.ast) || 0,
        blk: Number(profile.stats.blk) || 0,
        stl: Number(profile.stats.stl) || 0,
        pf: Number(profile.stats.pf) || 0,
        to: Number(profile.stats.to) || 0,
        pts: Number(profile.stats.pts) || 0,
      };

      // Object.values(profile.stats).forEach(stat => {
      //     careerStats?.stats?.gp++;
      //     careerStats?.stats?.fg += stat?.fg;
      //     careerStats?.stats?.threep += stat.threep;
      //     careerStats?.stats?.ft += stat.ft;
      //     careerStats?.stats?.reb += stat.reb;
      //     careerStats?.stats?.ast += stat.ast;
      //     careerStats?.stats?.blk += stat.blk;
      //     careerStats?.stats?.stl += stat.stl;
      //     careerStats?.stats?.pf += stat.pf;
      //     careerStats?.stats?.to += stat.to;
      //     careerStats?.stats?.pts += stat.pts;
      //   });
    }
    // Append career stats to profile
    let newProfile = {
      ...profile.toObject(),
      videoData,
      newsFeedData,
      stats: [careerStats],
    };
    console.log('PROFILE');
    console.log(newProfile);

    return res.status(200).json({
      profile: newProfile,
      players,
      showPlayers,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: 'Server error. Please retry.',
    });
  }
};

module.exports.deleteProfile = async (req, res) => {
  const { id } = req.params;
  try {
    let profile = await profileModel.deleteONe({ auth: id });
    return res.status(200).json({
      profile,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      error: 'Server error. Please retry.',
    });
  }
};

module.exports.getPlayer = async (req, res) => {
  try {
    // Fetch videos
    const videos = await videoModel.find({});

    // Create a map for quick lookup of videos by player ID
    const videoMap = new Map();
    if (videos && videos.length > 0) {
      videos.forEach((video) => {
        if (video.featuredPlayer) {
          const playerId = video.featuredPlayer.toString();
          if (!videoMap.has(playerId)) {
            videoMap.set(playerId, []);
          }
          videoMap.get(playerId).push(video);
        }
      });
    }

    // Fetch players and populate required fields
    const players = await playerModel
      .find({ status: "active" })
      .populate('institute')
      .populate('auth');

    // Fetch all profiles
    const profiles = await profileModel.find({});

    // Create a map for quick lookup of profiles by auth ID
    const profileMap = profiles.reduce((map, profile) => {
      map[profile.auth.toString()] = profile;
      return map;
    }, {});

    // Add offers, profile, and videos to each player
    const updatedPlayers = players.map((player) => {
      const playerAuthId = player?.auth?._id?.toString();
      const profile = profileMap[playerAuthId] || {};
      player = player.toObject(); // Convert to plain object to modify
      player.offers = profile.offers || [];
      player.profile = profile; // Add the entire profile object
      player.videos = videoMap.get(playerAuthId) || []; // Add videos
      return player;
    });

    return res.status(200).json({ players: updatedPlayers });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Server error. Please retry.' });
  }
};
module.exports.getHomeData = async (req, res) => {
  try {

    // const is_profile_complete = req.user.is_profile_complete || false;

    let featuredVideosData = await videoModel
      .find({ isfeatured: true })
      .limit(9).sort({ createdAt: -1 });
    let newsFeedData = await newsFeedModel.find({}).limit(3);
    let playersData = await playerModel.find({}).populate('auth');
    let classPlayers = await playerModel
      .find({ class: '2024' })
      .populate('auth');
    let testimonial = await testimonialmodel.find({});
    return res.status(200).json({
      // is_profile_complete,
      featuredVideosData,
      newsFeedData,
      playersData,
      classPlayers,
      testimonial,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: 'Server error. Please retry.',
    });
  }
};

module.exports.contactUs = async (req, res) => {

  let { name, email, message, mobilenumber } = req.body;
  console.log("print", req.body);
  try {

    const result = await contactusmodel.create({
      name,
      email,
      message,
      mobilenumber
    });

    res.status(200).json({
      message: 'SUCESS',
    });

    let jwtToken = await jwt.sign(
      { email, name, mobilenumber },
      process.env.JWT_TOKEN,
      { expiresIn: '15m' }
    );

    const emailHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    .header {
      color: #333;
      text-align: center;
    }
    .review {
      background-color: #f9f9f9;
      border-left: 4px solid #007BFF;
      margin: 20px 0;
      padding: 20px;
      border-radius: 4px;
    }
    .rating {
      text-align: right;
      font-size: 18px;
      font-weight: bold;
      color: #ff9500;
    }
    .button-container {
      text-align: center;
      margin-top: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #ff69b4;
      text-decoration: none;
      border-radius: 8px;
      box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 5px;
    }
  </style>
</head>
<body>

<div class="container">
  <div class="header">
    <h2>User message by ${name}</h2>
  </div>

  <div>
    <p>${message}</p>
  </div>
  
  <div class="button-container">
    <a href="http://192.168.1.38:5000/emailVerification_contactUs/${result._id}" class="button">Verify Your Email</a>
  </div>
</div>

</body>
</html>
`;


    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.user_email,
        pass: process.env.pass_email,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    const mailOptions = {
      from: process.env.user_email,
      to: email,
      subject: 'Account verification',
      html: emailHtmlContent,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error('Error sending email:', error);
      }
      if (info) {
        console.log(info);
        return res.status(200).json({
          message: 'Email verification sent successfully',
        });
      }
    });

    // const DOMAIN = "sandbox6a6c1146404048379fe04e593d00be67.mailgun.org";
    // const mg = mailgun({apiKey: "fb6c7a836dd23a28c5fc1dde55a1a060-408f32f3-f5c88aff", domain: DOMAIN});

    // const data = {
    // from: "shahg33285@gmail.com",
    // to: email,
    // subject: "Contact Us",
    // html:emailHtmlContent
    // };
    // mg.messages().send(data,async function (error, body) {
    //   console.log(body);
    //   console.log(error)
    //   if(!error){
    //     console.log("SUCESS")

    //   return res.status(200).json({
    //       message:'sucess'
    //   })
    //   }
    //   if(error){
    //     console.log(error)
    //   return res.status(400).json({
    //       message:error
    //   })
    //   }
    //   });


  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      error: 'Server error. Please retry.',
    });
  }
};


module.exports.emailVerification_contactUs = async (req, res) => {
  let { id } = req.params;

  try {

    const findcontactus = await contactusmodel.findById(id)

    findcontactus.is_verified = true

    await findcontactus.save()
    return res.send({ message: "Account has been verified." })


  } catch (e) {
    console.log(e);
    return res.status(400).json({
      error: 'Server error please retry',
    });
  }
};

module.exports.subscribeMail = async (req, res) => {
  let { email } = req.body;

  try {
    let alreadyExists = await mailmodel.find({
      subscribedBy: { $all: [email] },
    });

    if (alreadyExists.length > 0) {
      return res.status(400).json({
        error: 'Already subscribed',
      });
    }
    let finddata = await mailmodel.find({});
    if (finddata.length > 0) {
      await mailmodel.updateOne({}, { $push: { subscribedBy: email } });
    } else {
      await mailmodel.create({
        subscribedBy: email,
      });
    }

    return res.status(200).json({
      message: 'Subscribed successfully',
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      error: 'Server error. Please retry.',
    });
  }
};

module.exports.getLeads = async (req, res) => {
  try {
    const leads = await contactusmodel.find();
    return res.status(200).json({
      data: leads,
    });
    console.log(leads, "LEADS");
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      error: 'Server error. Please retry.',
    });
  }
};

module.exports.flagProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const alreadyFlagged = await profileModel.findOne({
      auth: id,
      flaggedBy: req.user._id,
    });

    if (alreadyFlagged) {
      console.log('UNFLAG');
      await profileModel.updateOne(
        { auth: id },
        { $pull: { flaggedBy: req.user._id } }
      );
      return res.status(200).json({
        message: 'Profile unflagged successfully',
      });
    }

    console.log('FLAG');
    await profileModel.updateOne(
      { auth: id },
      { $push: { flaggedBy: req.user._id } }
    );
    return res.status(200).json({
      message: 'Profile flagged successfully',
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      error: 'Server error. Please retry.',
    });
  }
};

module.exports.addRemoveFollow = async (req, res) => {
  const { id } = req.params;

  try {
    const player = await playerModel.findOne({ auth: id });

    if (!player) {
      return res.status(404).json({
        error: 'Player not found',
      });
    }

    const userId = req.user._id;
    const isFollowed = player.followedBy.includes(userId);

    if (isFollowed) {
      player.followedBy.pull(userId);
    } else {
      player.followedBy.push(userId);
    }

    await player.save();

    return res.status(200).json({
      message: isFollowed
        ? 'User unfollowed successfully'
        : 'User followed successfully',
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

module.exports.ratingRequest = async (req, res) => {
  const { playerId } = req.body;

  try {
    const playerDetails = await playerModel.findOne({ _id: playerId });
    if (!playerDetails) {
      return res.status(404).json({
        error: 'Player not found',
      });
    }
    if (!playerDetails.starRating && playerDetails.starRating !== 0) {
      await playerModel.findByIdAndUpdate(playerId, {
        isRequested: true,
      });
      return res.status(200).json({
        message: 'Requested',
      });
    } else {
      return res.status(400).json({
        error: 'Player has already rating',
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};


module.exports.unversity_find_with_search = async (req, res) => {
  try {

    const university_name = req.body.university_name

    if (!university_name) {
      return res.send({ status: 0, message: "University name is requuire." })
    }
    // Use regex to perform a case-insensitive search
    const find_university = await universityModel.find({
      universityName: { $regex: university_name, $options: 'i' }
    });


    // Return the found universities
    if (find_university.length > 0) {
      const uniqueUniversities = find_university.filter(
        (value, index, self) =>
          index === self.findIndex((university) => university.universityName === value.universityName)
      );
      res.send({ status: 1, message: "Universities found.", data: uniqueUniversities });
    } else {
      res.send({ status: 0, message: "No universities found." });
    }
  }
  catch (error) {
    return res.send({ status: 0, messagge: error.message })
  }

}

module.exports.all_player_location_list = async (req, res) => {
  try {
    const players = await playerModel.find({}, 'location').lean();

    // Extract locations and remove duplicates
    // const uniqueLocations = [...new Set(players.map(player => player.location))];

    const locationSet = new Set();
    const uniqueLocations = players.reduce((acc, player) => {
      const state = extractState(player.location);
      if (state && !locationSet.has(state)) {
        locationSet.add(state);
        acc.push({ state }); // Add state as an object
      }
      return acc;
    }, []);

    console.log(' uniqueLocations', uniqueLocations)
    return res.send({ status: 1, message: "Uniqe address.", data: uniqueLocations });

  }
  catch (error) {
    console.log("error", error)
    return res.send({ status: 0, messagge: error.message })

  }
}


// Helper function to extract state from the location string
function extractState(location) {
  const parts = location.split(',').map(part => part.trim());
  if (parts.length >= 2) {
    return parts[parts.length - 2]; // Assuming the state is the second-to-last part
  }
  return null;
}


module.exports.player_find_with_location = async (req, res) => {
  try {

    const location = req.body.location

    if (!location) {
      return res.send({ status: 0, message: "Please select a location." })
    }

    const all_player_location_list = await playerModel.find({ location: location, },).populate("auth")

    // var players = []
    // if (all_player_location_list.length > 0) {
    //   const objects = {}
    //   all_player_location_list.map(item => {
    //     objects.is_profile_complete = item.auth.is_profile_complete;
    //     objects._id = item.auth._id;
    //     objects.name = item.auth.name;
    //     objects.picture = item.picture;
    //     objects.location = item.location;
    //     objects.height = item.height;
    //     objects.position = item.position
    //     players.push(objects);
    //   })

    const playerData = all_player_location_list.map(item => {
      return {
        is_profile_complete: item.auth?.is_profile_complete || "",
        _id: item.auth?._id || "",
        name: item.auth?.name || "",
        picture: item.picture || "",
        location: item.location || "",
        height: item.height || "",
        position: item.position || ""
      };
    });


    return res.send({ status: 1, message: "player_find_with_location", data: playerData })

  }

  catch (error) {
    console.log("error", error)
    return res.send({ status: 0, messagge: error.message })

  }

}


module.exports.upload_video = async (req, res) => {
  try {
    const user_id = req.user._id;

    // Extract the single file and other data from the request
    const upload_video = req.file; // Since you're uploading a single file, use req.file
    const upload_video_link = req.body.upload_video_link;
    const upload_title = req.body.upload_title;
    const upload_description = req.body.upload_description;

    // Prepare an array to collect the uploaded video data
    const videoData = [];
    // If a video was uploaded, process it
    if (upload_video) {
      const videoDir = '/tmp/public/files/videos';

      // Ensure the directory exists
      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
      }

      const filename = `${Date.now()}-${upload_video.originalname}`;
      const finalname = path.join(videoDir, filename);

      // Save video file to the server
      fs.writeFileSync(finalname, upload_video.buffer);

      // Upload video to Cloudinary
      const videoUrl = await cloudinaryUpload(finalname);
      console.log('videoUrl', videoUrl.url); // Make sure the URL is correctly returned

      // Remove the local video file
      fs.unlinkSync(finalname);

      // Create a video entry in the database
      const videoEntry = await videoModel.create({
        title: upload_title || 'Video added by Player',
        description: upload_description || 'Video added by Player',
        featuredPlayer: user_id,
        video: videoUrl.url,  // Use the Cloudinary URL here
      });

      videoData.push(videoEntry);
    }

    // If a video link is provided, save it directly
    if (upload_video_link) {
      const videoEntry = await videoModel.create({
        title: upload_title || 'Video added by Player',
        description: upload_description || 'Video added by Player',
        featuredPlayer: user_id,
        video: upload_video_link,
      });

      videoData.push(videoEntry);
    }

    // Save the uploaded video details to the player's profile
    const playerUpdate = await playerModel.findOneAndUpdate(
      { auth: user_id },
      {
        upload_video: videoData.length > 0 ? videoData[0].video : "",
        upload_video_link: upload_video_link || "",
        upload_title: upload_title || "",
        upload_description: upload_description || "",
      },
      { new: true } // Return the updated document
    );


    return res.send({ status: 1, message: 'Video uploaded successfully', });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send({ status: 0, message: 'Something went wrong.' });
  }
};


module.exports.upload_embedded_video = async (req, res) => {
  try {
    const user_id = req.user._id;

    // Extract the single file and other data from the request
    const embedded_video = req.file; // Since you're uploading a single file, use req.file
    const embedded_video_link = req.body.embedded_video_link;
    const embedded_title = req.body.embedded_title;
    const embedded_description = req.body.embedded_description;

    // Prepare an array to collect the uploaded video data
    const videoData = [];
    // If a video was uploaded, process it
    if (embedded_video) {
      const videoDir = '/tmp/public/files/videos';

      // Ensure the directory exists
      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
      }

      const filename = `${Date.now()}-${embedded_video.originalname}`;
      const finalname = path.join(videoDir, filename);

      // Save video file to the server
      fs.writeFileSync(finalname, embedded_video.buffer);

      // Upload video to Cloudinary
      const videoUrl = await cloudinaryUpload(finalname);

      // Remove the local video file
      fs.unlinkSync(finalname);

      // Create a video entry in the database
      const videoEntry = await videoModel.create({
        title: embedded_title || 'Embedded Video added by Player',
        description: embedded_description || 'Embedded Video added by Player',
        featuredPlayer: user_id,
        video: videoUrl.url,  // Use the Cloudinary URL here
      });

      videoData.push(videoEntry);
    }

    console.log('videoData', videoData);

    // If an embedded video link is provided, save it directly
    if (embedded_video_link) {
      const videoEntry = await videoModel.create({
        title: embedded_title || 'Embedded Video added by Player',
        description: embedded_description || 'Embedded Video added by Player',
        featuredPlayer: user_id,
        video: embedded_video_link,
      });

      videoData.push(videoEntry);
    }

    // Save the uploaded embedded video details to the player's profile
    const playerUpdate = await playerModel.findOneAndUpdate(
      { auth: user_id },
      {
        embedded_video: videoData.length > 0 ? videoData[0].video : "",
        embedded_video_link: embedded_video_link || "",
        embedded_title: embedded_title || "",
        embedded_description: embedded_description || "",
      },
      { new: true } // Return the updated document
    );

    console.log('playerUpdate', playerUpdate); // Log the updated player document

    return res.send({ status: 1, message: 'Embedded Video uploaded successfully', data: videoData });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send({ status: 0, message: 'Something went wrong.' });
  }
};

module.exports.Weaknesses_Strengths = async (req, res) => {
  try {
    const { weaknesses, strengths, user_id } = req.body;
    // const user_id = req.user._id;

    // Find the player associated with the user
    const playerFind = await playerModel.findOne({ auth: user_id });

    if (!playerFind) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Prepare update data
    let updateData = {};
    if (weaknesses) updateData.weaknesses = weaknesses;
    if (strengths) updateData.strengths = strengths;

    // Update the player document with the new data if provided
    const updatedPlayer = await playerModel.findByIdAndUpdate(
      playerFind._id,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      message: 'Player data updated successfully',
      player: updatedPlayer,
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: 'Server error, please try again' });
  }
};

module.exports.scouting = async (req, res) => {
  try {
    const { user_id } = req.body

    const player_data = await playerModel.findOne({ auth: user_id }).populate("auth").populate("institute")
    const profile_data = await profileModel.findOne({ auth: user_id })
    let coach_profile
    if (coach_profile) {
      coach_profile = await coachModel.findOne({ auth: profile_data.coach })

    }

    const result = { player_data, profile_data, coach_profile }

    return res.send({ status: 1, message: "Data fatch success.", result })

  }
  catch (error) {
    console.log("error", error)
    return res.status(500).json({ error: 'Server error, please try again' });

  }
}


// school 
module.exports.school_list = async (req, res) => {
  const { searchText } = req.body;

  try {
    // Make a POST request to the third-party API
    const response = await axios.post('http://3.138.45.63:2027/university/schools_list', {
      search: searchText
    }, { timeout: 5000 });

    // Check if data was returned and filter using regex for partial matches
    if (response.data.data && response.data.data.length > 0) {
      const searchRegex = new RegExp(searchText, 'i');
      const result = response.data.data.filter(university => searchRegex.test(university.name));

      if (result.length > 0) {
        return res.status(200).json({
          status: 1,
          data: result,
          message: 'Universities found successfully'
        });
      } else {
        return res.status(404).json({
          status: 0,
          message: 'University not found'
        });
      }
    } else {
      return res.status(404).json({
        status: 0,
        message: 'No results returned from the API'
      });
    }
  } catch (error) {
    console.log('Error searching for the university:', error.message);
    return res.send({
      status: 0,
      message: 'Server error. Please try again later.',
      error
    });
  }
};



