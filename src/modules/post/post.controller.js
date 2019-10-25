import HTTPStatus from 'http-status';
import Post from './post.model';
import { nsp } from './../../services/socket.service';

export async function createPost(req, res) {
  try {
    const post = await Post.createPost(req.body, req.user._id);

    return res.status(HTTPStatus.CREATED).json(post);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
export async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate('user');

    return res.status(HTTPStatus.OK).json(post);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
export async function getPostsList(req, res) {
  const limit = parseInt(req.query.limit, 0);
  const skip = parseInt(req.query.skip, 0);
  const status = req.query.status;
  try {
    const posts = await Post.list({ status, limit, skip });
    return res.status(HTTPStatus.OK).json(posts);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function toggle(req, res) {
  try {
    const status1 = req.body.status;
    switch (status1) {
      case 'awaiting_to_verify': {
        const post = await Post.findByIdAndUpdate(req.params.id, {
          status: status1,
        }, { new: true });
        res.status(HTTPStatus.OK).json(post);
        break;
      }
      case 'verified': {
        const post = await Post.findByIdAndUpdate(req.params.id, {
          status: status1,
        }, { new: true });
        res.status(HTTPStatus.OK).json(post);
        break;
      }
      case 'awaiting_bid': {
        const post = await Post.findByIdAndUpdate(req.params.id, {
          status: status1,
        }, { new: true });
        nsp.emit('awaiting_bid', post._id);
        res.status(HTTPStatus.OK).json(post);
        break;
      }
      case 'bidding_started': {
        const post = await Post.findByIdAndUpdate(req.params.id, {
          status: status1,
        }, { new: true });
        nsp.emit('bidding_started', post._id);
        res.status(HTTPStatus.OK).json(post);
        break;
      }
      case 'bidding_done': {
        const post = await Post.findByIdAndUpdate(req.params.id, {
          status: status1,
        }, { new: true });
        nsp.emit('bidding_done', post._id);
        res.status(HTTPStatus.OK).json(post);
        break;
      }
      default:
        res.status(HTTPStatus.BAD_REQUEST).json('Provide valide status');
    }
  } catch (e) {
    res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
