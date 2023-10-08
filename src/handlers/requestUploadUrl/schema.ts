import type { FromSchema } from "json-schema-to-ts";

export const schema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        fileName: { type: "string", minLength: 1 },
        contentType: { type: "string", minLength: 1 },
      },
      required: ["fileName", "contentType"],
      additionalProperties: false,
    },
  },
  required: ["body"],
} as const;

export type SchemaBody = FromSchema<typeof schema.properties.body>;
