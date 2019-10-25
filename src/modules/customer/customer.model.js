import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import constants from '../../config/constants';
import { passwordConfig } from './customer.validation';

const customerSchema = new Schema({
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
  // post: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Post',
  //   },
  // ],

}, { timestamps: true });

customerSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken',
});

customerSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this._hashpassword(this.password);
  }
  return next();
});
customerSchema.methods = {
  _hashpassword(password) {
    return hashSync(password);
  },
  authenticateCustomer(password) {
    return compareSync(password, this.password);
  },
  createToken() {
    return jwt.sign(
      {
        _id: this._id,
        role: constants.CUSTOMER_KEY,
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
export default mongoose.model('Customer', customerSchema);
