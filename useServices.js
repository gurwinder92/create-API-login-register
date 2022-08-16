const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("../model/userModel");

async function register(req, res) {
  let check = await model.findOne({ email: req.body.email });
  const { password } = req.body;
  bcryptPassword = await bcrypt.hash(password, 10);

  if (!check) {
    const data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: bcryptPassword,
    }
    let createUser = await model.create(data);
    return res.status(200).send({
      msg: "register successfully",
      data: createUser,
    });
  }
  return res.status(400).send({
    msg: "user allready exist",
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await model.findOne({ email: email });
  if (user) {
    let compare = await bcrypt.compare(password, user.password);
    if (compare) {
      let data = {};
      const createToken = jwt.sign({ _id: user._id }, process.env.SEC_KEY);
      data.user = user;
      data.token = createToken;
      return res.status(200).send({
        msg: "user login successful",
        data: data,
      });
    }
  }
  return res.status(400).send({
    msg: "please check email or password",
  });
}

module.exports = {
  register,
  login,
};
