/* eslint-disable implicit-arrow-linebreak */
const { v1: uuidv1 } = require('uuid');
const aws = require('aws-sdk');
const fs = require('fs');

const {
  SECRET_ACCESS_KEY,
  ACCESS_KEY_ID,
  CLOUD_FRONT_URL,
  REGION,
  BUCKET_NAME,
} = require('../utils/config');

aws.config.setPromisesDependency();
aws.config.update({
  secretAccessKey: SECRET_ACCESS_KEY,
  accessKeyId: ACCESS_KEY_ID,
  region: REGION,
});

const S3 = new aws.S3();

const getParams = (folderName, file) => ({
  ACL: 'public-read',
  Bucket: BUCKET_NAME,
  Body: fs.createReadStream(file.path),
  Key: `${folderName}/${uuidv1()}.JPG`,
});

const upload = (params, cb) => S3.upload(params, cb);

const uploadToS3 = (files, folderName) =>
  new Promise((resolve, reject) => {
    const keysArray = [];
    if (Array.isArray(files)) {
      for (let i = 0; i < files.length; i += 1) {
        const params = getParams(folderName, files[i]);
        upload(params, (err, data) => {
          if (err) {
            console.log('Error uploading files', err);
            reject(err);
          }

          if (data) {
            fs.unlinkSync(files[i].path);
            keysArray.push(`${CLOUD_FRONT_URL}/${data.Key}`);
            if (files.length === keysArray.length) {
              resolve(keysArray);
            }
          }
        });
      }
    } else {
      let url = '';
      const params = getParams(folderName, files);
      upload(params, (err, data) => {
        if (err) {
          console.log('Error uploading files', err);
          reject(err);
        }
        if (data) {
          fs.unlinkSync(files.path);
          url = `${CLOUD_FRONT_URL}/${data.Key}`;
          resolve(url);
        }
      });
    }
  });

module.exports = { uploadToS3, S3 };
