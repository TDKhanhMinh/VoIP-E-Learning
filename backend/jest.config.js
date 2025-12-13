export default {
  // 1. Quan trọng nhất: Xác định môi trường là Node.js
  // (Mặc định Jest dùng jsdom cho Frontend, nếu không chỉnh cái này sẽ lỗi khi dùng thư viện Node)
  testEnvironment: 'node',

  // 2. Chỉ định thư mục gốc chứa các file test
  roots: ['<rootDir>/tests'],

  // 3. Pattern để Jest nhận diện đâu là file test
  // Nó sẽ tìm tất cả các file có đuôi .test.js hoặc .spec.js trong folder tests
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // 4. Bỏ qua không quét test trong node_modules
  testPathIgnorePatterns: ['/node_modules/'],

  // 5. Cấu hình Timeout (mặc định 5s)
  // Integration Test kết nối DB có thể lâu hơn, nên tăng lên 10s hoặc 20s
  testTimeout: 10000,

  // 6. Hiển thị chi tiết từng test case khi chạy (Pass/Fail)
  verbose: true,

  // 7. Tự động reset mocks giữa các test (tránh side effects)
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // 8. Tắt watch mode tự động (chỉ cho CI/CD)
  // watchman: false, // uncomment nếu có vấn đề với watchman

  // ========================================================
  // CẤU HÌNH COVERAGE (Báo cáo độ bao phủ code)
  // ========================================================
  
  // Tự động thu thập coverage khi chạy lệnh test
  collectCoverage: false, // Để false để chạy nhanh hơn, khi nào cần báo cáo thì bật flag --coverage sau
  
  // Thư mục chứa báo cáo (sẽ tự sinh ra folder 'coverage')
  coverageDirectory: 'coverage',

  // Chỉ tính coverage cho các file trong src
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/sockets/**',
    '!src/**/__tests__/**',
    '!src/**/node_modules/**',
  ],

  // Ngưỡng coverage tối thiểu (optional - bật khi project ổn định)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Định nghĩa các thiết lập bổ sung cho môi trường kiểm thử
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],



  // Các trình báo cáo coverage
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // Tiêm các globals cho môi trường ES module
  injectGlobals: true,
};