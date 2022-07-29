import crypto from "crypto";

const generateUUID = () => {
  return crypto.randomUUID();
};

export { generateUUID };
