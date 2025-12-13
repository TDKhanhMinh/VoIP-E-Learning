import { createClassCancellationHtml, createSummaryReadyHtml } from '../../../src/utils/emailTemplete.js';

describe('Email Template Utils', () => {
  describe('createClassCancellationHtml', () => {
    it('should generate valid HTML email template', () => {
      const params = {
        className: 'Lập trình Web',
        absenceDate: new Date('2024-03-15'),
        classTime: 'Ca 1 (7:00-9:30)',
        lecturerName: 'Nguyễn Văn A',
      };
      
      const html = createClassCancellationHtml(params);
      
      expect(html).toBeDefined();
      expect(typeof html).toBe('string');
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('</html>');
    });

    it('should include class name in template', () => {
      const params = {
        className: 'Data Structures',
        absenceDate: new Date('2024-03-15'),
        classTime: 'Ca 2',
        lecturerName: 'Teacher Name',
      };
      
      const html = createClassCancellationHtml(params);
      
      expect(html).toContain('Data Structures');
    });

    it('should include class time in template', () => {
      const params = {
        className: 'Test Class',
        absenceDate: new Date('2024-03-15'),
        classTime: 'Ca 3 (13:00-15:30)',
        lecturerName: 'Teacher Name',
      };
      
      const html = createClassCancellationHtml(params);
      
      expect(html).toContain('Ca 3 (13:00-15:30)');
    });

    it('should include lecturer name in template', () => {
      const params = {
        className: 'Test Class',
        absenceDate: new Date('2024-03-15'),
        classTime: 'Ca 1',
        lecturerName: 'Trần Thị B',
      };
      
      const html = createClassCancellationHtml(params);
      
      expect(html).toContain('Trần Thị B');
    });

    it('should contain cancellation notice heading', () => {
      const params = {
        className: 'Test',
        absenceDate: new Date(),
        classTime: 'Ca 1',
        lecturerName: 'Teacher',
      };
      
      const html = createClassCancellationHtml(params);
      
      expect(html).toContain('THÔNG BÁO NGHỈ HỌC');
    });

    it('should have proper HTML structure', () => {
      const params = {
        className: 'Test',
        absenceDate: new Date(),
        classTime: 'Ca 1',
        lecturerName: 'Teacher',
      };
      
      const html = createClassCancellationHtml(params);
      
      expect(html).toContain('<html');
      expect(html).toContain('<head>');
      expect(html).toContain('<body');
      expect(html).toContain('<table');
      expect(html).toContain('</table>');
      expect(html).toContain('</body>');
      expect(html).toContain('</html>');
    });

    it('should include styling information', () => {
      const params = {
        className: 'Test',
        absenceDate: new Date(),
        classTime: 'Ca 1',
        lecturerName: 'Teacher',
      };
      
      const html = createClassCancellationHtml(params);
      
      expect(html).toContain('style=');
      expect(html).toContain('background-color');
    });
  });

  describe('createSummaryReadyHtml', () => {
    it('should generate valid HTML email template', () => {
      const params = {
        lecturerName: 'Nguyễn Văn A',
        className: 'Machine Learning',
        completionTime: '15/03/2024 10:30',
      };
      
      const html = createSummaryReadyHtml(params);
      
      expect(html).toBeDefined();
      expect(typeof html).toBe('string');
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('</html>');
    });

    it('should include lecturer name in template', () => {
      const params = {
        lecturerName: 'Trần Thị B',
        className: 'AI Course',
        completionTime: '15/03/2024 10:30',
      };
      
      const html = createSummaryReadyHtml(params);
      
      expect(html).toContain('Trần Thị B');
    });

    it('should include class name in template', () => {
      const params = {
        lecturerName: 'Teacher',
        className: 'Deep Learning',
        completionTime: '15/03/2024 10:30',
      };
      
      const html = createSummaryReadyHtml(params);
      
      expect(html).toContain('Deep Learning');
    });

    it('should include completion time in template', () => {
      const params = {
        lecturerName: 'Teacher',
        className: 'Course',
        completionTime: '20/03/2024 14:45',
      };
      
      const html = createSummaryReadyHtml(params);
      
      expect(html).toContain('20/03/2024 14:45');
    });

    it('should contain summary completion heading', () => {
      const params = {
        lecturerName: 'Teacher',
        className: 'Course',
        completionTime: '15/03/2024',
      };
      
      const html = createSummaryReadyHtml(params);
      
      expect(html).toContain('HOÀN TẤT TÓM TẮT BÀI GIẢNG');
    });

    it('should have proper HTML structure', () => {
      const params = {
        lecturerName: 'Teacher',
        className: 'Course',
        completionTime: '15/03/2024',
      };
      
      const html = createSummaryReadyHtml(params);
      
      expect(html).toContain('<html');
      expect(html).toContain('<head>');
      expect(html).toContain('<body');
      expect(html).toContain('<table');
      expect(html).toContain('</body>');
      expect(html).toContain('</html>');
    });

    it('should include green success styling', () => {
      const params = {
        lecturerName: 'Teacher',
        className: 'Course',
        completionTime: '15/03/2024',
      };
      
      const html = createSummaryReadyHtml(params);
      
      expect(html).toContain('#5cb85c'); // Green color
      expect(html).toContain('background-color');
    });

    it('should mention AI system', () => {
      const params = {
        lecturerName: 'Teacher',
        className: 'Course',
        completionTime: '15/03/2024',
      };
      
      const html = createSummaryReadyHtml(params);
      
      expect(html).toContain('AI');
      expect(html).toContain('Hệ thống LMS');
    });
  });

  describe('Email template consistency', () => {
    it('both templates should use similar HTML structure', () => {
      const cancelParams = {
        className: 'Class',
        absenceDate: new Date(),
        classTime: 'Ca 1',
        lecturerName: 'Teacher',
      };
      
      const summaryParams = {
        lecturerName: 'Teacher',
        className: 'Class',
        completionTime: '15/03/2024',
      };
      
      const cancelHtml = createClassCancellationHtml(cancelParams);
      const summaryHtml = createSummaryReadyHtml(summaryParams);
      
      // Both should have DOCTYPE
      expect(cancelHtml).toContain('<!DOCTYPE html>');
      expect(summaryHtml).toContain('<!DOCTYPE html>');
      
      // Both should have meta charset
      expect(cancelHtml).toContain('charset="UTF-8"');
      expect(summaryHtml).toContain('charset="UTF-8"');
      
      // Both should use tables for layout
      expect(cancelHtml).toContain('<table');
      expect(summaryHtml).toContain('<table');
    });

    it('both templates should be mobile responsive', () => {
      const cancelHtml = createClassCancellationHtml({
        className: 'Test',
        absenceDate: new Date(),
        classTime: 'Ca 1',
        lecturerName: 'Teacher',
      });
      
      const summaryHtml = createSummaryReadyHtml({
        lecturerName: 'Teacher',
        className: 'Test',
        completionTime: '15/03/2024',
      });
      
      expect(cancelHtml).toContain('viewport');
      expect(summaryHtml).toContain('viewport');
    });
  });
});
