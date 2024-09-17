const jwt = require("jsonwebtoken");
const isAuthenticated = async (req, res, next) => {
  //Get the token from the header
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1];
  //! Verify the token
  const verifyToken = jwt.verify(token, "jorasiyaKey", (err, decoded) => {
    console.log(decoded);
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
  if (verifyToken) {
    //! Save the user req obj
    req.user = verifyToken.id;
  } else {
    const err = new Error("Session expired");
  }
  next();
};

module.exports = isAuthenticated;
