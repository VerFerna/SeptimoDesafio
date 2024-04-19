import handlebars from "express-handlebars";
import { isEmptyArray, isSessionStarted } from "../helpers/utils.js";

const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    isEmptyArray: isEmptyArray,
    isSessionStarted: isSessionStarted,
  },
});

export default hbs;
