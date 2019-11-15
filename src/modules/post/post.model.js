import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  source: {
    type: String,
    required: [true, 'source address is required'],
    trim: true,
    maxlength: [35, 'Address is too long'],
  },
  destination: {
    type: String,
    required: [true, 'destination address is required'],
    trim: true,
    maxlength: [35, 'Address is too long'],
  },
  distance: {
    type: Number,
    default: 0,
  },
  itemDescription: {
    type: String,
    trim: true,
    maxlength: [40, 'Describe breifly not more than 40 characters'],
  },
  image: {
    type: String,
    default: 'image.png',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',

  },
  status: {
    type: String,
    enum: [
      'awaiting_to_verify',
      'verified',
      'awaiting_bid',
      'bidding_started',
      'bidding_done',
      'delivered',
    ],
    default: 'awaiting_to_verify',
  },
}, { timestamps: true });

PostSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      source: this.source,
      destination: this.destination,
      distance: this.distance,
      itemDescription: this.itemDescription,
      status: this.status,
      createdAt: this.createdAt,
      user: this.user,
    };
  },
};

PostSchema.statics = {
  createPost(args, user) {
    return this.create({
      ...args,
      user,
    });
  },
  list({ status = 'verified', skip = 0, limit = 3 } = {}) {
    return this.find({ status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user');
  },
};

export default mongoose.model('Post', PostSchema);
