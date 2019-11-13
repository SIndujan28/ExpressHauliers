import mongoose, { Schema } from 'mongoose';
import { compareSync, hashSync } from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import constants from './../../config/constants'
;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'email address is required'],
  },
  role: {
    type: String,
    enum: [
      'customer',
      'transporter',
    ],
    default: 'customer',
  },
  type: {
    type: String,
    enum: [
      'local',
      'google',
      'twitter',
      'facebook',
    ],
    default: 'local',
  },
  profileImage: {
    type: String,
    default: 'profile.png',
  },
  profileImageVersion: {
    type: Number,
    default: 0,
  },
  userName: {
    type: String,
    trim: true,
    unique: true,
  },
  metadata: {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: [
        function () { return this.type === 'local'; },
        'password is required for local users',
      ],
    },
    address: {
      type: String,
      trim: true,
    },
    vehicle: {
      type: String,
      trim: true,
    },
  },
}, { timestamps: true });

userSchema.pre('save', function (next) {
  if (this.isModified('metadata.password')) {
    this.metadata.password = this._hashpassword(this.metadata.password);
  }
  return next();
});
userSchema.methods = {
  _hashpassword(password) {
    return hashSync(password);
  },
  authenticateUser(password) {
    return compareSync(password, this.metadata.password);
  },
  createToken() {
    return jwt.sign({
      _id: this._id,
      role: this.role,
    }, constants.JWT_SECRET);
  },
  toAuthJSON() {
    return {
      _id: this._id,
      userName: this.userName,
      token: `Bearer ${this.createToken()}`,
      email: this.email,

    };
  },
  toJSON() {
    return {
      _id: this._id,
      userName: this.userName,
      password: this.metadata.password,

    };
  },

};
export default mongoose.model('User', userSchema);
