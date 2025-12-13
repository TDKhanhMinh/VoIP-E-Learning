export default {
  // Môi trường Node.js (tránh lỗi khi dùng thư viện backend)
  testEnvironment: "node",

  // Thư mục chứa test
  roots: ["<rootDir>/tests"],

  // Nhận diện file test (.test.js / .spec.js)
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],

  // Bỏ qua node_modules
  testPathIgnorePatterns: ["/node_modules/"],

  // Timeout cho test (ms)
  testTimeout: 10000,

  // Hiển thị chi tiết kết quả test
  verbose: true,

  // Reset mocks sau mỗi test
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // ================= Coverage =================

  // Không thu thập coverage mặc định (bật bằng --coverage)
  collectCoverage: false,

  // Thư mục output coverage
  coverageDirectory: "coverage",

  // Chỉ tính coverage trong src
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!src/sockets/**",
    "!src/**/__tests__/**",
    "!src/**/node_modules/**",
  ],

  // Ngưỡng coverage tối thiểu
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Setup môi trường test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Các dạng báo cáo coverage
  coverageReporters: ["text", "lcov", "html", "json"],

  // Inject globals cho ES module
  injectGlobals: true,
};
