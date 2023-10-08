import UploadUrlResponse from "./UploadUrlResponse";
import { SchemaBody } from "./schema";

export const newSignedUrlParams = (requestBody: SchemaBody, bucket: string) => {
  const { fileName, contentType } = requestBody;

  const s3Params = {
    Bucket: bucket,
    Key: fileName,
    ContentType: contentType,
    ACL: "public-read",
  };

  return s3Params;
};

export const newUploadUrlRepsonse = (uploadUrl: string): UploadUrlResponse => {
  const response: UploadUrlResponse = {
    uploadUrl,
  };

  return response;
};
