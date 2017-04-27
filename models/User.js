const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const moment = require("moment");

const UserSchema = new Schema(
  {
    username: {type: String, required: true, unique: true},
    passwordHash: {type: String},
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    level: {type: Number, default: 1},
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    points: {type: Number, default: 0}
  },
  {timestamps: true}
);

UserSchema.plugin(uniqueValidator);

UserSchema.virtual("prettydate").get(function() {
  return moment(this.createdAt).format("MM-DD-YYYY");
});

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.methods.populateChildren = async function() {
  let user = await User.findByID(this._id).populate(children);
  user.children.map(async child => {
    return await child.populateChildren();
  });
  return user;
};

UserSchema.virtual("password")
  .get(function() {
    return this._password;
  })
  .set(function(value) {
    this._password = value;
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

const User = mongoose.model("User", UserSchema);

module.exports = User;
