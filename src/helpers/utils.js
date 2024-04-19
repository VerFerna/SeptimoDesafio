import { UserModel } from "../dao/models/user.model.js";
import multer from "multer";
import { hashSync, compareSync, genSaltSync } from "bcrypt";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

//Multer
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

//Bcrypt
export const createHash = (password) => {
  return hashSync(password, genSaltSync(10));
};

export const isValidPassword = (password, user) => {
  return compareSync(password, user.password);
};

//Passport
export const serializeUser = (user, done) => {
  done(null, user._id);
}

export const deserializeUser = async (id, done) => {
  const user = await UserModel.findById({_id: id});
  done(null, user);
}

//FS
export function getNextId(path) {
  const data = fs.readFileSync(path);
  const products = JSON.parse(data);

  const count = products.length;
  const nextId = count > 0 ? products[count - 1].id + 1 : 1;

  return nextId;
}

export async function createFile(path) {
  try {
    await fs.promises.access(path);
  } catch (error) {
    await fs.promises.writeFile(path, "[]");

    console.log(`File created successfully - ${getLocaleTime()}`);
  }
}

export async function saveData(data, path) {
  try {
    await fs.promises.writeFile(path, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(error);
  }
}

export async function readData(path) {
  try {
    const data = await fs.promises.readFile(path, "utf-8");
    const products = JSON.parse(data);
    return products;
  } catch (error) {
    console.log(error);
  }
}

export const isEmptyArray = (array, options) => {
  if (Array.isArray(array) && array.length === 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

//Handlebars
export const isSessionStarted = (req, options) => {
  if (req.session.login === true) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

//General
export function getLocaleTime() {
  const time = new Date().toLocaleTimeString();
  return time;
}
