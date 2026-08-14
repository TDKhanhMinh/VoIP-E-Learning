import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const email = required('FIRST_ADMIN_EMAIL').toLowerCase();
const password = required('FIRST_ADMIN_PASSWORD');
const fullName = process.env.FIRST_ADMIN_FULL_NAME?.trim() || undefined;
const uri = required('MONGO_URI');

if (process.env.MONGO_ENABLED?.toLowerCase() !== 'true')
  throw new Error(
    'Set MONGO_ENABLED=true before bootstrapping the first admin.',
  );
if (password.length < 12)
  throw new Error('FIRST_ADMIN_PASSWORD must be at least 12 characters.');
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
  throw new Error('FIRST_ADMIN_EMAIL must be a valid email address.');

const connection = await mongoose
  .createConnection(uri, { serverSelectionTimeoutMS: 5000 })
  .asPromise();

try {
  const database = connection.db;
  if (!database) throw new Error('MongoDB connection has no database handle.');
  const users = database.collection('users');
  const existingAdmin = await users.findOne({ role: 'admin' });
  if (existingAdmin)
    throw new Error('An admin account already exists; bootstrap is one-time.');

  const now = new Date();
  const userId = new mongoose.Types.ObjectId();
  const passwordHash = await bcrypt.hash(password, 12);
  await users.insertOne({
    _id: userId,
    fullName,
    email,
    emailNormalized: email,
    passwordHash,
    accountStatus: 'active',
    role: 'admin',
    emailVerifiedAt: now,
    createdAt: now,
    updatedAt: now,
  });
  await database.collection('audit_logs').insertOne({
    event: 'first_admin_bootstrapped',
    userId,
    email,
    performedAt: now,
    source: 'bootstrap-first-admin-cli',
  });
  process.stdout.write(
    `${JSON.stringify({ event: 'first_admin_bootstrapped', email, timestamp: now.toISOString() })}\n`,
  );
} finally {
  await connection.close();
}
