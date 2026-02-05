import { createToken, verifyToken } from "../src/utils/auth.js";

describe("auth utils", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  it("should create and verify token", () => {
    const token = createToken({
      id: 1,
      email: "test@example.com",
      role: "user",
    });
    const payload = verifyToken(token);
    expect(payload.id).toBe(1);
    expect(payload.email).toBe("test@example.com");
    expect(payload.role).toBe("user");
  });
});
