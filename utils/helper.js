import { HTTP_STATUS } from "./constant.js";
import fs from "fs";
import request from "request";
export const constructResponse = (res, responseData) => {
  const { success, message, status, data } = responseData;
  if (success)
    return res.status(status).json({
      data,
      message,
      success: true,
    });
  if (data)
    return res.status(status).json({
      data,
      message,
      success: false,
    });
  return res.status(status).json({
    message,
    success: false,
  });
};

export const successResponse = (data, status, message) => ({
  data,
  status: status || HTTP_STATUS.OK,
  message,
  success: true,
});

export const errorResponse = (status, message, data = null) => ({
  data,
  status: status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
  message: message || "Internal server error",
  success: false,
});

export const helper = {
  get: (options) => {
    return new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) reject(error);
        resolve(JSON.parse(body).secure_url);
      });
    });
  },}


export const cloudinaryOptions = (image) => {
  let options = {
    method: "POST",
    url: "https://api.cloudinary.com/v1_1/bng/image/upload",
    headers: {
      "cache-control": "no-cache",
      "content-type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    },
    formData: {
      file: {
        value: fs.readFileSync(image),
        options: { filename: "r.png", contentType: null },
      },
      upload_preset: "uploadApi",
      cloud_name: "bng",
    },
  };
  return options;
};