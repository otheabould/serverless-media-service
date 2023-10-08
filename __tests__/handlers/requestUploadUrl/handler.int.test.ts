import UploadUrlResponse from "@handlers/requestUploadUrl/UploadUrlResponse";
import { SchemaBody } from "@handlers/requestUploadUrl/schema";
import axios from "axios";

const baseURL = `https://${process.env.httpApiGatewayEndpointId}.execute-api.${process.env.region}.amazonaws.com`;

describe("requestUploadUrl handler", () => {
  it("should respond with statusCode 200 to correct request", async () => {
    const payload: SchemaBody = {
      fileName: "file.jpeg",
      contentType: "image/jpeg",
    };

    const actual = await axios.post(`${baseURL}/requestUploadUrl`, payload);
    expect(actual.status).toBe(200);
  });

  it("should respond with created url", async () => {
    const payload: SchemaBody = {
      fileName: "file.jpeg",
      contentType: "image/jpeg",
    };

    const response = await axios.post<UploadUrlResponse>(
      `${baseURL}/requestUploadUrl`,
      payload,
    );
    const actual = response.data;

    expect(actual.uploadUrl).toBeTruthy();
  });

  it("should respond with Bad Request 400 to incorrect request", async () => {
    const wrongPayload = {};

    let actual;
    try {
      await axios.post(`${baseURL}/requestUploadUrl`, wrongPayload);
    } catch (e) {
      actual = e.response;
    }

    expect(actual.status).toBe(400);
    expect(actual.statusText).toBe("Bad Request");
  });
});
