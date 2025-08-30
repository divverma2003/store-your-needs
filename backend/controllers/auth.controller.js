import User from "../models/user.model.js";
export const register = async (req, res) => {
  res.send("Register route called.");
};

export const login = async (req, res) => {
  res.send("Login route called.");
};

export const logout = async (req, res) => {
  res.send("Logout route called.");
};
