const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'nextTour_DEV',  //Folder name in your Cloudinary media library
      allowedFormats: ["png" , "jpg" , "jpeg"] // Restrict to accepted formats (array of strings)
    },
  });

module.exports = {cloudinary , storage};