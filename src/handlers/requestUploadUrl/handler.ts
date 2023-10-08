import { S3 } from "aws-sdk";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import middyValidator from "@middy/validator";
import middyErrorHandler from "@middy/http-error-handler";
import { transpileSchema } from "@middy/validator/transpile";

import { apiResponses, ValidatedHttpApiHandler } from "@utils/apiGateway";

import { schema, SchemaBody } from "./schema";
import { newSignedUrlParams, newUploadUrlRepsonse } from "./factory";

const handler: ValidatedHttpApiHandler<SchemaBody> = async (event) => {
  const s3 = new S3();

  const params = newSignedUrlParams(event.body, process.env.BUCKET_NAME);
  const uploadURL = await s3.getSignedUrlPromise("putObject", params);

  const response = newUploadUrlRepsonse(uploadURL);
  return apiResponses._200(response);
};

export const main = middy(handler)
  .use(middyJsonBodyParser())
  .use(middyValidator({ eventSchema: transpileSchema(schema) }))
  .use(middyErrorHandler());
