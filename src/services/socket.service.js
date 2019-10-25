import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import jwt from 'jsonwebtoken';
import Redis from 'ioredis';
import constants from './../config/constants';
import Post from './../modules/post/post.model';

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const redis = new Redis();

const nsp = io.of('/betting-room');

nsp.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, constants.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Unauthorized'));
      if (decoded.role !== constants.TRANSPORTER_KEY) return next(new Error('Unauthorized'));
      socket.user_id = decoded._id;
      next();
    });
  } else {
    next(new Error('Unauthorized'));
  }
});

nsp.on('connection', (socket) => {
  socket.on('join_room', async (roomId) => {
    const post = await Post.findById(roomId);
    if (post && post.status === 'bidding_started') {
      socket.join(roomId);
      console.log(post._id);
      socket.emit('joined_room', roomId);
      socket.room_id = roomId;
      console.log(socket.id, socket.room_id);
      socket.to(socket.room_id).emit(`${socket.user_id} joined the room`);
    } else {
      socket.emit('dump_move', 'betting not started yet');
    }
  });

  socket.on('betting_data', (data) => {
    if (isNaN(data)) {
      socket.emit('dump_move', 'Not a number');
    }
    if (!socket.room_id) {
      socket.emit('dump_move', 'join a room to emit data');
    }
    // addRedis(socket, socket.room_id, data.toString(), socket.user_id, (err, res) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     nsp.in(socket.room_id).emit('bet_amount', res);
    //   }
    // });
    redisOps(socket, socket.room_id, data.toString(), socket.user_id);
  });
  socket.on('leave-room', (room) => {
    if (socket.room_id === room) {
      socket.leave(room);
    }
  });
});

// function addRedis(socket, roomId, amt, userId) {
//   let prevScore;
//   redis.zscore(roomId, userId, (err, res) => {
//     prevScore = res;
//     console.log(`=========${prevScore}`);
//   });

//   if (prevScore && amt >= prevScore) {
//     socket.emit('error', 'anew');
//   }
//   redis.zadd(roomId, amt, userId);

//   redis.zrevrange(roomId, 0, 1, 'WITHSCORES', (err, res) => {
//     if (err) {
//       return err;
//     }
//     console.log(res);
//     nsp.in(socket.room_id).emit('final', res);
//   });
// }
function redisOps(socket, roomId, amt, userId) {
  const promise = redis.zscore(roomId, userId);
  promise.then((res) => {
    if (amt >= res && res !== null) {
      console.log(res);
      socket.emit('dump_move', 'cant enter higher than last time');
      return;
    } else if (res == null) {
      redis.zadd(roomId, amt, userId);
      nsp.in(socket.room_id).emit('final', { userId, amt });
    }
  },
  () => {
    redis.zadd(roomId, amt, userId);
    nsp.in(socket.room_id).emit('final', { user_id: userId, amount: amt });
  });
}

export { app, server, nsp };