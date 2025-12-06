import { formatVietnameseDate } from "./formatVietnameseDate.js";

export const createClassCancellationHtml = ({
  className,
  absenceDate,
  classTime,
  lecturerName,
}) => {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Thông báo nghỉ học</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
                    
                    <tr>
                        <td align="center" style="background-color: #d9534f; padding: 30px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                                THÔNG BÁO NGHỈ HỌC
                            </h1>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 40px 30px; color: #555; font-size: 16px; line-height: 1.7;">
                            <p style="font-size: 18px; font-weight: bold; color: #333;">
                                Thân gửi các bạn sinh viên,
                            </p>
                            <p>
                                Giảng viên/Khoa xin thông báo về việc tạm nghỉ một buổi học của môn <strong>${className}</strong>.
                            </p>
                            
                            <div style="background-color: #fef9f9; border: 1px solid #f8d7da; border-radius: 5px; padding: 20px; margin: 25px 0;">
                                <h3 style="margin-top: 0; color: #721c24;">Chi tiết buổi học nghỉ:</h3>
                                <p style="margin-bottom: 8px;"><strong>Lớp:</strong> ${className}</p>
                                <p style="margin-bottom: 8px;"><strong>Ngày nghỉ:</strong> ${formatVietnameseDate(
                                  absenceDate
                                )}</p>
                                <p style="margin-bottom: 8px;"><strong>Thời gian:</strong> ${classTime}</p>
                                <p style="margin: 0;"><strong>Lý do:</strong> Giảng viên có lịch công tác đột xuất.</p>
                            </div>
                            
                            <p>
                                <strong>Về lịch học bù:</strong>
                                <br />
                                Lịch học bù sẽ được thông báo qua hệ thống trong thời gian sớm nhất.
                            </p>
                            <p>
                                Các bạn vui lòng theo dõi các thông báo tiếp theo trên hệ thống hoặc email.
                            </p>
                            <p style="margin-top: 25px;">
                                Xin lỗi vì sự bất tiện này và cảm ơn sự thông cảm của các bạn.
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="background-color: #f9f9f9; padding: 30px 30px; text-align: center; color: #888; font-size: 14px;">
                            <p style="margin: 0;">Trân trọng,</p>
                            <p style="margin: 5px 0 0 0; font-weight: bold; color: #555;">${lecturerName}</p>
                            <p style="margin: 5px 0 0 0;">Khoa Công nghệ Thông tin</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    
</body>
</html>
`;
};

export const createSummaryReadyHtml = ({
  lecturerName,
  className,
  completionTime,
}) => {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
 <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thông báo Tóm tắt buổi học online hoàn thành</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
  
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="padding: 20px 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
          
          <tr>
            <td align="center" style="background-color: #5cb85c; padding: 30px 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                HOÀN TẤT TÓM TẮT BÀI GIẢNG
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px; color: #555; font-size: 16px; line-height: 1.7;">
              <p style="font-size: 18px; font-weight: bold; color: #333;">
                Kính gửi thầy/cô ${lecturerName},
              </p>
              <p>
                Hệ thống AI đã hoàn tất việc xử lý ghi âm buổi học và tạo bản tóm tắt cũng như bản chép lời.
              </p>
              
              <div style="background-color: #eaf8ea; border: 1px solid #d4edda; border-radius: 5px; padding: 20px; margin: 25px 0;">
                <h3 style="margin-top: 0; color: #155724;">Chi tiết tóm tắt:</h3>
                <p style="margin-bottom: 8px;"><strong>Môn học:</strong> ${className}</p>
                <p style="margin-bottom: 8px;"><strong>Hoàn thành lúc:</strong> ${completionTime}</p>
                <p style="margin: 0;">
                  Vui lòng <strong>kiểm tra</strong> và <strong>chỉnh sửa lần cuối</strong> trước khi công bố cho sinh viên.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px 30px; text-align: center; color: #888; font-size: 14px;">
              <p style="margin: 0;">Trân trọng,</p>
              <p style="margin: 5px 0 0 0; font-weight: bold; color: #555;">Hệ thống LMS</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  
</body>
</html>
`;
};
