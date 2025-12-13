// Note: This would typically be in frontend tests
// If using Jest in frontend, move to: d:\VoIP E-Learning\frontend\src\pages\Admin\__tests__\

const validateUser = (user) => {
  const errors = [];

  if (!user.full_name || user.full_name.trim() === "") {
    errors.push("Tên không được để trống");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.email || !emailRegex.test(user.email)) {
    errors.push("Email không hợp lệ");
  }

  if (!user.role || !["admin", "teacher", "student"].includes(user.role)) {
    errors.push("Vai trò không hợp lệ (admin/teacher/student)");
  }

  return errors;
};

describe('ManageUsers validateUser', () => {
  it('should validate valid user data', () => {
    const validUser = {
      full_name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    };
    const errors = validateUser(validUser);
    expect(errors).toHaveLength(0);
  });

  it('should fail when full_name is empty', () => {
    const invalidUser = {
      full_name: '',
      email: 'john@example.com',
      role: 'student'
    };
    const errors = validateUser(invalidUser);
    expect(errors).toContain('Tên không được để trống');
  });

  it('should fail when full_name is only whitespace', () => {
    const invalidUser = {
      full_name: '   ',
      email: 'john@example.com',
      role: 'student'
    };
    const errors = validateUser(invalidUser);
    expect(errors).toContain('Tên không được để trống');
  });

  it('should fail when email is invalid', () => {
    const invalidUser = {
      full_name: 'John Doe',
      email: 'invalid-email',
      role: 'student'
    };
    const errors = validateUser(invalidUser);
    expect(errors).toContain('Email không hợp lệ');
  });

  it('should fail when role is invalid', () => {
    const invalidUser = {
      full_name: 'John Doe',
      email: 'john@example.com',
      role: 'superuser'
    };
    const errors = validateUser(invalidUser);
    expect(errors).toContain('Vai trò không hợp lệ (admin/teacher/student)');
  });

  it('should return multiple errors for multiple invalid fields', () => {
    const invalidUser = {
      full_name: '',
      email: 'bad-email',
      role: 'invalid'
    };
    const errors = validateUser(invalidUser);
    expect(errors).toHaveLength(3);
  });
});
