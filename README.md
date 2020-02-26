# ExpressHauliers

## Description
This a backend API for an imaginery gig-based transportation company called ExpressHauliers where users who wants freight to be moved from one place to another can submit load details along with an image.Users who signed up in our service as transporter can bid their way to obtain the contract.Bidding starts only after freight details are validated.We use image recognition to inspect whether the image matches with what user claimed it to be.Once bidding started any transporter can bid and whomever bid the lowest amount gets the contract.

# Requirements
* Node.js 10.16
* Mongodb 4.0
* Redis 5.0
* Socket.io 2.3
* AWS S3
* AWS Rekognition


## Getting started

 ### Prerequisites
  1. npm or yarn
  2. mongodb
  3. Redis
  4. socket.io

Make sure to have proper aws account set up and have access to AWS S3 and Rekognition services 

 ### Steps to reproduce locally
  1. Clone this repository
```bash
     git clone git@github.com:SIndujan28/ExpressHauliers.git
```
  2. Run the following command to install all the neccessary modules.
```
     npm install
```
  or
```
    yarn install
```
  3. Enter all necessary keys in sample.env file and rename it as .env file.

  4. Make sure the mongodb instance is running.

  5. Then run the following command to bundle all files.
```bash
    npm run dev:build
```

  6. Finally run this command to start the server.
```bash
    npm run dev
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
