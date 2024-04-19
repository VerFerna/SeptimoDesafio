import { UserModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../../helpers/utils.js";
import { getLocaleTime } from "../../helpers/utils.js";

class UserManager {
  createUser = async (user) => {
    try {
      const validate = await UserModel.findOne({ email: user.email });

      if (validate) {
        console.log(`Email ${user.email} already exists - ${getLocaleTime()}`);
        throw new Error(`Email ${user.email} already exists`);
      }

      const newUser = await UserModel.create(user);

      console.log(`User created - ${getLocaleTime()}`);
      return true;
    } catch (error) {
      throw error;
    }
  };

  getUsers = async () => {
    try {
      const users = await UserModel.find();

      return users;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  getUserByEmail = async (email) => {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        console.log(`User not exist - ${getLocaleTime()}`);
        throw new Error("User not exist");
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  updatePassword = async (email, password) => {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        console.log(`Email ${email} not exists - ${getLocaleTime()}`);
        throw new Error(`Email ${email} not exists`);
      }

      const samePassword = isValidPassword(password, user);

      if (samePassword) {
        console.log(`Same password - ${getLocaleTime()}`);
        throw new Error("Same password");
      }

      const userId = user._id;

      const userNewPassword = await UserModel.findByIdAndUpdate(userId, {
        password: createHash(password),
      });

      console.log(`Password reset - ${getLocaleTime()}`);
      return true;
    } catch (error) {
      throw error;
    }
  };
}

export default UserManager;
