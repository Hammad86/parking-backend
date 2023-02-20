import { HTTP_STATUS } from "../utils/constant.js";
import { errorResponse, successResponse } from "../utils/helper.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { helper } from "../utils/helper.js";
import { cloudinaryOptions } from "../utils/helper.js";
const register = async (data) => {
  try {
    const { name, email, password, vehicleNumber, cnicNumber,pickerValue,park ,uri } = data;
    if (
      name !== undefined &&
      email !== undefined &&
      password !== undefined &&
      vehicleNumber !== undefined &&
      cnicNumber !== undefined &&
      pickerValue !== undefined &&
      park !== undefined &&
      uri !== undefined
    ) {
      let user = await User.findOne({ email });
      if (user === null) {
        if (password ) {
          try {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            let userDetail = {
              name,
              email,
              password: hashPassword,
              vehicleNumber,
              cnicNumber,
              pickerValue,
              park,
              uri
            };
            let newUser = await User.create(userDetail);
            let save_user = await User.findOne({ email });
            let payload = {
              _id: save_user._id,
              name: save_user.name,
              email: save_user.email,
              password: save_user.password,
              vehicleNumber: save_user.vehicleNumber,
              cnicNumber: save_user.cnicNumber,
              pickerValue: save_user.pickerValue,
              park: save_user.park,
              uri: save_user.uri
            };

            //Generate Token
            let token = jwt.sign(payload, process.env.SECERET_KEY, {
              expiresIn: "30d",
            });

            let result = {
              token,
              user: payload,
            };
            return successResponse(
              result,
              HTTP_STATUS.OK,
              "User Registered Successfully!!!"
            );
          } catch (error) {
            console.log(error);
            return errorResponse(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              "Enable to register",
              null
            );
          }
        } else {
          return errorResponse(
            HTTP_STATUS.OK,
            "Password does not match your confirm password",
            null
          );
        }
      } else {
        return errorResponse(
          HTTP_STATUS.OK,
          "This email already exist please try to unqiue email.",
          null
        );
      }
    } else {
      return errorResponse(
        HTTP_STATUS.OK,
        "All fields are required",
        null
      );
    }
  } catch (error) {
    return errorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      null
    );
  }
};

const login = async (data) => {
  try {
    const {name, email, password ,vehicleNumber, cnicNumber,pickerValue, park} = data;
    if (email !== undefined && password !== undefined) {
      let user = await User.findOne({ email });
      if (user !== null) {
        let hasPassword = user?.password;
        let isMatch = bcrypt.compareSync(password, hasPassword);

        let payload = {
          _id: user?._id,
          name: user?.name,
          vehicleNumber: user?.vehicleNumber,
          cnicNumber: user?.cnicNumber,
          pickerValue: user?.pickerValue,
          email: user?.email,
          password: hasPassword,
          park:user?.park
        };

        if (isMatch) {
          // Generate Token
          let token = jwt.sign(payload, process.env.SECERET_KEY, {
            expiresIn: "30d",
          });

          let result = {
            token,
            user: payload,
          };
          return successResponse(
            result,
            HTTP_STATUS.OK,
            "User Login Successfully Login"
          );
        } else {
          return errorResponse(
            HTTP_STATUS.UNAUTHORIZED,
            "Invalid password",
            null
          );
        }
      } else {
        return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Unauthorized user", null);
      }
    } else {
      return errorResponse(
        HTTP_STATUS.NO_CONTENT,
        "All fields are required",
        null
      );
    }
  } catch (error) {
    console.log('err',error);
    return errorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      null
    );
  }
};

const getUser = async (data) => {
  try {
    const { user_id } = data;
    if (user_id !== null && user_id !== undefined) {
      let user = await User.findById({ _id: user_id });
      if (user !== null) {
        return successResponse(
          user,
          HTTP_STATUS.OK,
          "Get User Details Successfully"
        );
      }
      else {
        return errorResponse(HTTP_STATUS.NOT_FOUND, "User Not Exist", null);
      }
    }
    else {
      return errorResponse(
        HTTP_STATUS.NO_CONTENT,
        "User id is required",
        null
      );
    }
  } catch (error) {
    return errorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      null
    );
  }
}

const updateUser = async (data) => {
  try {
    const { name, email, password, user_id } = data;
    if (user_id !== null) {
      try {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        let updateUser = await User.findOneAndUpdate(
          { _id: user_id },
          {
            name, email, password: hashPassword,
          }
        );
        if (
          updateUser.length === 0 ||
          updateUser === undefined ||
          updateUser === null ||
          updateUser === ""
        ) {
          return errorResponse(HTTP_STATUS.NOT_FOUND, "User Not Exist", null);
        } else {
          let save_user = await User.findOne({ email });
          let payload = {
            _id: save_user._id,
            name: save_user.name,
            email: save_user.email,
            password: save_user.password,
            vehicleNumber: save_user.vehicleNumber,
              cnicNumber: save_user.cnicNumber,
              pickerValue: save_user.pickerValue,
          };

          //Generate Token
          let token = jwt.sign(payload, process.env.SECERET_KEY, {
            expiresIn: "31d",
          });

          let result = {
            token,
            user: payload,
          };
          return successResponse(
            result,
            HTTP_STATUS.OK,
            "User Updated Successfully!!!"
          );
        }
      } catch (error) {
        console.log(error);
        return errorResponse(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          "Enable to Update.",
          null
        );
      }
    } else {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Unauthorized user", null);
    }
  }
  catch (error) {
    return errorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      null
    );
  }
}

const deleteUser = async (data) => {
  try {
    const { user_id } = data;
    if (user_id === null || user_id === undefined) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "UnAuthorized User", null);
    }
    else {
      let deleteUser = await User.deleteOne({ _id: user_id });
      if (
        deleteUser["deletedCount"] === 0 ||
        deleteUser === null ||
        deleteUser === undefined
      ) {
        return errorResponse(HTTP_STATUS.NOT_FOUND, "User Does Not Exist", null);
      } else if (
        deleteUser["deletedCount"] === 1 ||
        deleteUser !== null ||
        deleteUser !== undefined
      ) {
        return successResponse(
          deleteUser,
          HTTP_STATUS.OK,
          "User Deleted Successfully"
        );
      }
    }
  } catch (error) {
    return errorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      null
    );
  }
}

const getAllData = async () => {
  try {
      let user = await User.find();
      if (user) {
        
        return successResponse(
          user,
          HTTP_STATUS.OK,
          "Get User Details Successfully"
        );
      }
      else {
        console.log('user');
        return errorResponse(HTTP_STATUS.NOT_FOUND, "User Not Exist", null);
      }
    
  }
  catch(error){
    console.log('315',error);
    res.status(500).json({message: error.message})
}
}
    
const updateUserData = async (data) => {
  try {
    const { name,park, user_id } = data;
    if (user_id !== null) {
      try {
        
        let updateUser = await User.findOneAndUpdate(
          { _id: user_id },
          {
            name, 
            park
          }
        );
        if (
          // updateUser.length === 0 ||
          // updateUser === undefined ||
          // updateUser === null ||
          updateUser === ""
        ) {
          return errorResponse(HTTP_STATUS.NOT_FOUND, "User Not Exist", null);
        } else {
          let save_user = await User.findOne({ name });
          let payload = {
            _id: save_user._id,
            name: save_user.name,
            email: save_user.email,
            vehicleNumber: save_user.vehicleNumber,
              cnicNumber: save_user.cnicNumber,
              pickerValue: save_user.pickerValue,
              park: save_user.park
          };

          let result = {
            user: payload,
          };
          return successResponse(
            result,
            HTTP_STATUS.OK,
            "User Updated Successfully!!!"
          );
        }
      } catch (error) {
        console.log(error);
        return errorResponse(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          "Enable to Update.",
          null
        );
      }
    } else {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Unauthorized user", null);
    }
  }
  catch (error) {
    return errorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      null
    );
  }
}

const uploadImage = async(req,res) =>{
try {
  let image = req.files.image.tempFilePath
  let options = await cloudinaryOptions(image);
  let profileImageUrl = await helper.get(options);
  console.log("image URL ",profileImageUrl);
  return successResponse(
    profileImageUrl,
    HTTP_STATUS.OK,
    "User Updated Successfully!!!"
  );
} catch (error) {
  console.log(error);
}
}

export default {
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
  getAllData,
  updateUserData,
  uploadImage
};
