import { ObjectId, type Document } from 'mongodb';

export const LEGACY_USER_ID = new ObjectId('507f1f77bcf86cd799439011');
export const LEGACY_COURSE_ID = new ObjectId('507f191e810c19729de860e1');

export function legacyUserFixture(): Document {
  return {
    _id: LEGACY_USER_ID,
    full_name: 'Legacy Teacher',
    email: ' Teacher@Example.COM ',
    password: `$2b$12$${'a'.repeat(53)}`,
    role: 'teacher',
    available: false,
  };
}

export function legacyCourseFixture(): Document {
  return {
    _id: LEGACY_COURSE_ID,
    code: ' cs-101 ',
    title: 'Introduction to Computer Science',
    credit: 3,
    description: 'Legacy description',
  };
}
