import requestUploadUrl from "@handlers/requestUploadUrl";
import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "serverless-media-service",
  frameworkVersion: "3",
  plugins: [
    "serverless-iam-roles-per-function",
    "serverless-esbuild",
    "serverless-export-env",
  ],

  provider: {
    name: "aws",
    stage: "${opt:stage, 'dev'}",
    runtime: "nodejs14.x",
    region: "eu-west-1",
    logRetentionInDays: 60,

    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      BUCKET_NAME: "${param:bucketName}",

      // vars for tests
      httpApiGatewayEndpointId: { Ref: "HttpApi" },
      stage: "${self:provider.stage}",
      region: "${self:provider.region}",
      service: "${self:service}",
    },
  },
  // import the function via paths
  functions: { requestUploadUrl },

  params: {
    default: {
      bucketName: "${self:service}-${self:provider.stage}",
    },
  },

  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: false,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },

    "export-env": {
      filename: ".env.test",
      overwrite: true,
    },
  },

  package: {
    individually: true,
    patterns: [
      // include
      "src/**",
      // exclude
      "!*",
      "!__tests__/**",
      "!documentation/**",
      "!config/**",
      "!jestConfig/**",
    ],
  },

  resources: {
    Resources: {
      MediaBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${param:bucketName}",
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: false,
          },
          OwnershipControls: {
            Rules: [{ ObjectOwnership: "ObjectWriter" }],
          },
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ["*"],
                AllowedHeaders: ["*"],
                AllowedMethods: ["GET", "PUT", "POST", "HEAD"],
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
