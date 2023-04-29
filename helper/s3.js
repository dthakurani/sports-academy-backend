require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');

const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const bucket = process.env.AWS_BUCKET_NAME;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

const uploadImage = async (file, fileName) => {
  const uploadParams = {
    Bucket: bucket,
    ACL: 'public-read',
    Body: file.buffer,
    Key: fileName
  };
  const data = await s3.upload(uploadParams).promise();
  return data;
};

module.exports = {
  uploadImage
};
