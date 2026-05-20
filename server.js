const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const BUCKET = process.env.S3_BUCKET;

app.post("/get-upload-url", async (req, res) => {
  const { fileName, fileType } = req.body;

  const key = `videos/${Date.now()}-${fileName}`;

  const params = {
    Bucket: BUCKET,
    Key: key,
    Expires: 60,
    ContentType: fileType
  };

  const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

  res.json({
    uploadUrl,
    videoUrl: uploadUrl.split("?")[0]
  });
});

app.listen(3000, () => {
  console.log("Server ishlayapti: http://localhost:3000");
});
