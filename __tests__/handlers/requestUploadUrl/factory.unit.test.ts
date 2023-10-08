import {
  newSignedUrlParams,
  newUploadUrlRepsonse,
} from "@handlers/requestUploadUrl/factory";
import { SchemaBody } from "@handlers/requestUploadUrl/schema";

describe("factory", () => {
  describe("newSignedUrlParams", () => {
    it("should map the existing fields", () => {
      const requestBody: SchemaBody = {
        fileName: "test.jpg",
        contentType: "image/jpeg",
      };
      const actual = newSignedUrlParams(requestBody, "some-bucket");

      expect(actual.Key).toBe("test.jpg");
      expect(actual.ContentType).toBe("image/jpeg");
      expect(actual.Bucket).toBe("some-bucket");
    });

    it("should set ACL", () => {
      const requestBody: SchemaBody = {
        fileName: "test.jpg",
        contentType: "image/jpeg",
      };
      const actual = newSignedUrlParams(requestBody, "some-bucket");
      expect(actual.ACL).toBe("public-read");
    });
  });

  describe("newUploadUrlRepsonse", () => {
    it("should set the correct fields", () => {
      const actual = newUploadUrlRepsonse("a url");
      expect(actual.url).toBe("some url");
    });
  });
});
