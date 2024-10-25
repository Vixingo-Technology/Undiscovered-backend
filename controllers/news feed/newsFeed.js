const authmodel = require('../../models/auth/auth');
let newsFeedModel = require('../../models/news feed/newsFeed');
const playerModel = require('../../models/player/player');
const { cloudinaryUpload } = require('../../utils/cloudinary');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

module.exports.createNewsFeed = async (req, res) => {
  let { title, description, featuredPlayers, name_of_author, title_of_author } = req.body;

  // Access the uploaded files
  const { banner, image_of_author } = req.files;

  featuredPlayers = featuredPlayers.split(',').map((id) => id.trim());

  try {
    const bannerDir = '/tmp/public/files/images';
    if (!fs.existsSync(bannerDir)) {
      fs.mkdirSync(bannerDir, { recursive: true });
    }

    // Function to save image to Cloudinary
    const saveImage = async (file) => {
      let filename = `${Date.now()}-${file.originalname}`;
      let finalname = path.join(bannerDir, filename);

      fs.writeFileSync(finalname, file.buffer);

      let imageUrl = await cloudinaryUpload(finalname);

      fs.unlinkSync(finalname);

      return imageUrl.url;
    };

    // Save the banner and image_of_author images
    let bannerUrl = await saveImage(banner[0]);
    let authorImageUrl = await saveImage(image_of_author[0]);

    // Create the news feed entry
    await newsFeedModel.create({
      title,
      description,
      featuredPlayers,
      banner: bannerUrl,
      image_of_author: authorImageUrl,
      name_of_author,
      title_of_author
    });

    return res.status(200).json({
      message: 'News feed successfully created',
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({
      error: 'Server error please retry',
    });
  }
};



module.exports.getNewsFeed = async (req, res) => {
  try {
    const topNews = await newsFeedModel.find({ type: 'Top news' });
    const highlights = await newsFeedModel.find({ type: 'Highlights' });
    const interviews = await newsFeedModel.find({ type: 'Interviews' });

    return res.status(200).json({
      topNews,
      highlights,
      interviews,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({
      error: 'Server error, please retry',
    });
  }
};

module.exports.getAllNewsFeed = async (req, res) => {
  try {
    const type = req.query.type;
    let news = await newsFeedModel.find({
      ...(type && { type }),
    });
    return res.status(200).json({
      data: news,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({
      error: 'Server error please retry',
    });
  }
};

module.exports.getSingleNewsFeed = async (req, res) => {
  let { id } = req.params;

  try {
    let newsFeed = await newsFeedModel
      .findOne({ _id: id })
      .populate('featuredPlayers');
    let players = [];
    for (let i = 0; i < newsFeed.featuredPlayers.length; i++) {
      let player = await playerModel.findOne({
        auth: newsFeed.featuredPlayers[i]?._id,
      });
      players.push(player);
    }
    newsFeed = newsFeed.toObject();
    newsFeed = {
      ...newsFeed,
      players,
    };
    console.log(newsFeed, "NEWSS>>>");

    return res.status(200).json({
      newsFeed,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({
      error: 'Server error please retry',
    });
  }
};

module.exports.deleteNewsFeed = async (req, res) => {
  let { id } = req.params;
  try {
    await newsFeedModel.deleteOne({ _id: id });
    return res.status(200).json({
      message: 'News feed deleted',
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({
      error: 'Server error please retry',
    });
  }
};

module.exports.editNewsFeed = async (req, res) => {
  let { id, title, description, featuredPlayers, name_of_author, title_of_author } = req.body;

  // Access the uploaded files
  const { banner, image_of_author } = req.files || {};

  try {
    // Prepare data to update
    let updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (name_of_author) updateData.name_of_author = name_of_author;
    if (title_of_author) updateData.title_of_author = title_of_author;

    if (featuredPlayers && featuredPlayers.length > 0) {
      featuredPlayers = featuredPlayers.split(',').map((id) => id.trim());
      updateData.featuredPlayers = featuredPlayers;
    }

    const saveImage = async (file) => {
      const bannerDir = '/tmp/public/files/images';
      if (!fs.existsSync(bannerDir)) {
        fs.mkdirSync(bannerDir, { recursive: true });
      }

      let filename = `${Date.now()}-${file.originalname}`;
      let finalname = path.join(bannerDir, filename);

      fs.writeFileSync(finalname, file.buffer);

      let imageUrl = await cloudinaryUpload(finalname);

      fs.unlinkSync(finalname);

      return imageUrl.url;
    };

    if (banner) {
      let bannerUrl = await saveImage(banner[0]);
      if (bannerUrl) updateData.banner = bannerUrl;
    }

    if (image_of_author) {
      let authorImageUrl = await saveImage(image_of_author[0]);
      if (authorImageUrl) updateData.image_of_author = authorImageUrl;
    }

    // Update the news feed entry
    let updatedNewsFeed = await newsFeedModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedNewsFeed) {
      return res.status(404).json({ error: 'News feed not found' });
    }

    return res.status(200).json({
      message: 'News feed successfully updated',
      newsFeed: updatedNewsFeed,
    });
  } catch (e) {
    console.log("error", e);
    return res.status(500).json({
      error: 'Server error, please try again',
    });
  }
};


module.exports.getPlayers = async (req, res) => {
  try {
    let players = await authmodel.find({});
    return res.status(200).json({
      players,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: 'Server error, please try again',
    });
  }
};
