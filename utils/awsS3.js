const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

async function uploadImageToS3(imageBuffer, imageName) {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `playlists/${imageName}`,
        Body: imageBuffer,
        ContentType: 'image/png',
        ACL: 'public-read',
    };

    const result = await s3.upload(params).promise();
    return result.Location; // Return public URL
}

module.exports = { uploadImageToS3 };