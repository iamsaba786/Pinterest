import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUrl = (file) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();

  // ✅ Must return string, use .content
  return parser.format(extName, file.buffer).content;
};

export default getDataUrl;
