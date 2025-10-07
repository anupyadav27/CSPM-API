import AWS from "aws-sdk";

const connectDynamoDB = () => {
  const region = process.env.AWS_REGION;
  const endpoint = process.env.DYNAMODB_ENDPOINT;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey || !region) {
    throw new Error("AWS credentials or region not set in environment variables.");
  }

  AWS.config.update({
    region,
    accessKeyId,
    secretAccessKey,
    endpoint,
  });

  const dynamoDB = new AWS.DynamoDB();
  const documentClient = new AWS.DynamoDB.DocumentClient();

  console.log(`DynamoDB connected in region: ${region}`);

  return { dynamoDB, documentClient };
};

export default connectDynamoDB();
