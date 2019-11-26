process.env.NODE_ENV = 'test';

const fs=require('fs')
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const server = require('./../src/index');
const User = require('./../src/modules/user/user.model');

const should = chai.should();
chai.use(chaiHttp);
before('mongo connection',(done)=>{
  mongoose.connect('mongodb://127.0.0.1/uship-customer-test');
    mongoose.connection.once('open', () => {
      mongoose.connection.collection('users').drop()
      done();
     });

})
describe('User', () => {
  let token=''
  describe('/GET home', () => {
    it('should reply alo camigos', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('Signup', () => {
    it('should signup', (done) => {
      chai.request(server)
        .post('/api/v2/user/signup')
        .type('form')
        .send({
          email: 'sindu#@gcscsmail.com',
          password: 'qweAQsSC123',
          firstName: 'Sinduajan',
          lastName: 'Krusnfdc',
          userName: 'sefsxxefae13',
          role: 'transporter',
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe('login', () => {

    it('should login', (done) => {
      chai.request(server)
        .post('/api/v2/user/login')
        .type('form')
        .send({
          email: 'sindu#@gcscsmail.com',
          password: 'qweAQsSC123',
        })
        .end((err, res) => {
          res.should.have.status(200);
          token=res.body.token


          done();
        });
    });
  });
  describe('upload image',()=>{
    it('should be able to upload image',(done)=>{
      chai.request(server)
      .post('/api/v2/user/upload')
      .set('authorization',token)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .field('Content-Type', 'multipart/form-data')
      .attach('files',fs.readFileSync("/home/sindu/Pictures/Screenshot from 2019-07-31 21-18-16.png"),'photo')
      .end((err,res)=>{
        console.log(res)
        res.should.have.status(200);
      })
    })
  })
  // after('remove all',async ()=>{
  //   await mongoose.connection.collection('users').drop()
  // })
});
