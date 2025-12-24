import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendMailMock = vi.fn();

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: sendMailMock,
    })),
  },
}));

describe("Email Service", () => {
  let emailService;
  let nodemailer;

  beforeEach(async () => {
    process.env.GMAIL_USER = "test@gmail.com";
    process.env.GMAIL_PASSWORD = "password123";

    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    vi.resetModules();
    emailService = await import("../../../src/service/emailService.js");
    nodemailer = (await import("nodemailer")).default;
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks(); 
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_PASSWORD;
  });

  describe("Service structure", () => {
    it("should export sendEmail function", () => {
      expect(emailService.sendEmail).toBeDefined();
      expect(typeof emailService.sendEmail).toBe("function");
    });
  });

  describe("sendEmail", () => {
    const emailData = {
      to: "receiver@test.com",
      subject: "Test Subject",
      html: "<p>Hello</p>",
      from: "sender@test.com",
      text: "Hello (text)",
    };

    it("should configure transporter correctly", async () => {
      sendMailMock.mockResolvedValue({ messageId: "123" });

      await emailService.sendEmail(
        emailData.to,
        emailData.subject,
        emailData.html,
        emailData.from,
        emailData.text
      );

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "test@gmail.com",
          pass: "password123",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    });

    it("should send email successfully and return info", async () => {
      const mockInfo = { messageId: "msg_123_abc", response: "250 OK" };
      sendMailMock.mockResolvedValue(mockInfo);

      const result = await emailService.sendEmail(
        emailData.to,
        emailData.subject,
        emailData.html,
        emailData.from,
        emailData.text
      );

      expect(sendMailMock).toHaveBeenCalledWith({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      });

      expect(console.log).toHaveBeenCalledWith(
        "Email đã được gửi thành công:",
        mockInfo.messageId
      );

      expect(result).toEqual(mockInfo);
    });

    it("should throw error if sending fails", async () => {
      const mockError = new Error("SMTP Connection Timeout");
      sendMailMock.mockRejectedValue(mockError);

      await expect(
        emailService.sendEmail(
          emailData.to,
          emailData.subject,
          emailData.html,
          emailData.from,
          emailData.text
        )
      ).rejects.toThrow("SMTP Connection Timeout");

      expect(console.error).toHaveBeenCalledWith(
        "Lỗi khi gửi email:",
        mockError
      );
    });

    it("should log error if ENV vars are missing", async () => {
      delete process.env.GMAIL_USER;
      delete process.env.GMAIL_PASSWORD;
      vi.resetModules();

      const emailServiceReloaded = await import(
        "../../../src/service/emailService.js"
      );
      sendMailMock.mockResolvedValue({});

      await emailServiceReloaded.sendEmail(
        emailData.to,
        emailData.subject,
        emailData.html,
        emailData.from,
        emailData.text
      );

      expect(console.error).toHaveBeenCalledWith(
        "LỖI: MAIL_USER hoặc MAIL_PASS chưa được cấu hình trong .env!"
      );
    });
  });
});
