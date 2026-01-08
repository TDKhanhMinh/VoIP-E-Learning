===================================
HƯỚNG DẪN CHẠY DỰ ÁN
===================================

YÊU CẦU HỆ THỐNG:
- Docker và Docker Compose đã được cài đặt
- Cổng 80, 3000, và 5000 chưa bị sử dụng

-----------------------------------
CÁCH 1: CHẠY BẰNG DOCKER
-----------------------------------

1. Mở terminal/command prompt tại thư mục chứa source code

2. Chạy lệnh khởi động Docker:
   docker compose up -d

3. Chờ cho tới khi các image build xong (lần đầu có thể mất vài phút)

4. Kiểm tra trạng thái các container:
   docker compose ps

5. Truy cập ứng dụng:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:5000

6. Dừng ứng dụng:
   docker compose down

7. Xem logs nếu có lỗi:
   docker compose logs -f

-----------------------------------
CÁCH 2: CHẠY TRỰC TIẾP (Development)
-----------------------------------

BACKEND:
1. Di chuyển vào thư mục backend:
   cd backend

2. Cài đặt dependencies:
   npm install

3. Chạy server:
   npm start
   hoặc (development mode):
   npm run dev

FRONTEND:
1. Mở terminal mới và di chuyển vào thư mục frontend:
   cd frontend

2. Cài đặt dependencies:
   npm install

3. Chạy ứng dụng:
   npm run dev

4. Truy cập: http://localhost:5173 (hoặc cổng được hiển thị trong terminal)

-----------------------------------
KHẮC PHỤC SỰ CỐ
-----------------------------------

- Nếu cổng đã được sử dụng: Dừng ứng dụng đang chạy trên cổng đó
- Nếu build thất bại: Xóa các container và image cũ:
  docker compose down
  docker system prune -a
  
- Rebuild lại:
  docker compose up -d --build

-----------------------------------
TÀI KHOẢN TEST
-----------------------------------

Hệ thống cung cấp 3 tài khoản mẫu với các quyền khác nhau để test:

1. TÀI KHOẢN ADMIN (Quản trị viên)
   - Email: 50000000@tdtu.edu.vn
   - Mật khẩu: 123456

2. TÀI KHOẢN TEACHER (Giáo viên)
   - Email: 51000000@tdtu.edu.vn
   - Mật khẩu: 123456

3. TÀI KHOẢN STUDENT (Học sinh)
   - Email: 530000001@tdtu.edu.vn
   - Mật khẩu: 123456

===================================


