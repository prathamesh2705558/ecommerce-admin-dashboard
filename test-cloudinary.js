require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("⏳ Attempting to upload image...");

// Using Cloudinary's own demo image which never fails
cloudinary.uploader.upload(
  "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  { public_id: "test_image_new" }, 
  (error, result) => {
    if (error) {
      console.log("❌ Error:", error);
    } else {
      console.log("✅ Success! Your setup is perfect.");
      console.log("Image URL:", result.secure_url);
    }
  }
);