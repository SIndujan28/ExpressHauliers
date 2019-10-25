import mongoose, { Schema } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import validator from 'validator';
import uniqueValidator from 'mongoose-unique-validator';
import jwt from 'jsonwebtoken';

import { passwordConfig } from './transporter.validation';
import constants from './../../config/constants';

const transporterSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'email address is required'],
    trim: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: '{VALUE} is not a valid email',
    },

  },
  firstName: {
    type: String,
    required: [true, 'FirstName is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
    trim: true,
  },
  userName: {
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password cant be empty'],
    trim: true,
    minlength: [6, 'password must be more than 6 characters'],
    validate: {
      validator(password) {
        return passwordConfig.test(password);
      },
      message: ' {VALUE} is not a valid password',
    },
  },
  address: {
    type: String,
    trim: true,
    required: [true, 'Address should be listed'],

  },
  vehicleModel: {
    type: String,
    trim: true,
    minlength: [3, 'provide valid vehicle model'],
  },

}, { timestamps: true });

transporterSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken',
});

transporterSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this._hashpassword(this.password);
  }
  return next();
});
transporterSchema.methods = {
  _hashpassword(password) {
    return hashSync(password);
  },
  authenticateTransporter(password) {
    return compareSync(password, this.password);
  },
  createToken() {
    return jwt.sign(
      {
        _id: this._id,
        role: constants.TRANSPORTER_KEY,
      },
      constants.JWT_SECRET,
    );
  },
  toAuthJSON() {
    return {
      _id: this._id,
      userName: this.userName,
      token: `JWT ${this.createToken()}`,
      email: this.email,
    };
  },
  toJSON() {
    return {
      _id: this._id,
      userName: this.userName,
    };
  },

};
export default mongoose.model('Transporter', transporterSchema);
