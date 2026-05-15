import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";

if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
  });
}

export async function uploadProfilePhoto(file?: Express.Multer.File) {
  if (!file) return undefined;
  if (!config.cloudinary.cloudName) return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "family-tree/profiles",
    transformation: [{ width: 640, height: 640, crop: "fill", gravity: "face" }]
  });
  return result.secure_url;
}
