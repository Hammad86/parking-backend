import authServices from "../../services/authServices.js";
import { constructResponse } from "../../utils/helper.js";

const register = async (req, res) => {
  const response = await authServices.register(req.body);
  return constructResponse(res, response);
};

const login = async (req, res) => {
  const response = await authServices.login(req.body);
  return constructResponse(res, response);
};

const getUser = async (req, res) => {
  const response = await authServices.getUser(req.body);
  return constructResponse(res, response);
};

const updateUser = async (req, res) => {
  const response = await authServices.updateUser(req.body);
  return constructResponse(res, response);
};

const deleteUser = async (req, res) => {
  const response = await authServices.deleteUser(req.body);
  return constructResponse(res, response);
};

const getAllData = async (req, res) => {
  const response = await authServices.getAllData(req.body);
  return constructResponse(res, response);
};

const updateUserData = async (req, res) => {
  const response = await authServices.updateUserData(req.body);
  return constructResponse(res, response);
};

const uploadImage = async (req, res) => {
  const response = await authServices.uploadImage(req,res);
  return constructResponse(res, response);
};


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
