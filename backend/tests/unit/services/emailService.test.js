import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// 1. MOCK NODEMAILER
// Tạo mock function cho sendMail để ta có thể thay đổi kết quả trả về (thành công/thất bại)
const sendMailMock = vi.fn();

vi.mock("nodemailer", () => ({
  default: {
    // createTransport trả về object chứa hàm sendMail
    createTransport: vi.fn(() => ({
      sendMail: sendMailMock,
    })),
  },
}));

describe("Email Service", () => {
  // Biến lưu module service sau khi import
  let emailService;
  let nodemailer;

  beforeEach(async () => {
    // 2. SETUP ENV VARS
    // Cần set env trước khi import service vì file service đọc env ngay ở dòng đầu
    process.env.GMAIL_USER = "test@gmail.com";
    process.env.GMAIL_PASSWORD = "password123";

    // Mock console để không in log rác ra terminal khi chạy test
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    // 3. IMPORT MODULES
    // Reset modules để đảm bảo env var mới được nhận
    vi.resetModules();
    emailService = await import("../../../src/service/emailService.js");
    nodemailer = (await import("nodemailer")).default;
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks(); // Khôi phục console
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_PASSWORD;
  });

  // ==========================
  // Structure Tests
  // ==========================
  describe("Service structure", () => {
    it("should export sendEmail function", () => {
      expect(emailService.sendEmail).toBeDefined();
      expect(typeof emailService.sendEmail).toBe("function");
    });
  });

  // ==========================
  // sendEmail Function Tests
  // ==========================
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

      // Kiểm tra createTransport được gọi đúng config Gmail
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
      // Giả lập gửi thành công
      sendMailMock.mockResolvedValue(mockInfo);

      const result = await emailService.sendEmail(
        emailData.to,
        emailData.subject,
        emailData.html,
        emailData.from,
        emailData.text
      );

      // Kiểm tra sendMail được gọi đúng tham số options
      expect(sendMailMock).toHaveBeenCalledWith({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      });

      // Kiểm tra log success được gọi
      expect(console.log).toHaveBeenCalledWith(
        "Email đã được gửi thành công:",
        mockInfo.messageId
      );

      expect(result).toEqual(mockInfo);
    });

    it("should throw error if sending fails", async () => {
      const mockError = new Error("SMTP Connection Timeout");
      // Giả lập gửi thất bại
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

      // Kiểm tra log error được gọi
      expect(console.error).toHaveBeenCalledWith(
        "Lỗi khi gửi email:",
        mockError
      );
    });

    it("should log error if ENV vars are missing", async () => {
      // Xóa env vars và load lại module
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
