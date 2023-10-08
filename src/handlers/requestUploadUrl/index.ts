import { handlerPath } from "@utils/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: "POST",
        path: "/requestUploadUrl",
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["s3:GetObject", "s3:PutObject", "s3:PutObjectAcl"],
      Resource: "arn:aws:s3:::${param:bucketName}/*",
    },
  ],
};
