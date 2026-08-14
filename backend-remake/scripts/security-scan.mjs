import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, extname, relative, resolve } from 'node:path';

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../..',
);
const repositoryScope = process.argv.includes('--repo');
const ignoredDirectories = new Set([
  '.git',
  'coverage',
  'dist',
  'logs',
  'node_modules',
]);

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = resolve(directory, entry.name);
    if (entry.isDirectory())
      return ignoredDirectories.has(entry.name) ? [] : listFiles(absolutePath);
    return entry.isFile()
      ? [relative(repositoryRoot, absolutePath).replaceAll('\\', '/')]
      : [];
  });
}

const scannedFiles = listFiles(
  repositoryScope ? repositoryRoot : resolve(repositoryRoot, 'backend-remake'),
);

const textExtensions = new Set([
  '',
  '.cjs',
  '.env',
  '.example',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
]);
const violations = [];

for (const scannedFile of scannedFiles) {
  const normalized = scannedFile.replaceAll('\\', '/');
  const basename = normalized.split('/').at(-1) ?? normalized;
  const isEnvironmentFile = basename === '.env' || basename.startsWith('.env.');
  const isExample = basename.endsWith('.example');

  if (isEnvironmentFile && !isExample)
    violations.push({ file: normalized, rule: 'tracked-environment-file' });
  if (/credentials?\.json$/iu.test(basename))
    violations.push({ file: normalized, rule: 'tracked-credential-file' });
  if (/\.(?:key|p12|pfx|pem)$/iu.test(basename))
    violations.push({ file: normalized, rule: 'tracked-private-key-file' });

  const extension = extname(basename).toLowerCase();
  if (!textExtensions.has(extension)) continue;

  let content;
  try {
    content = readFileSync(resolve(repositoryRoot, scannedFile), 'utf8');
  } catch {
    continue;
  }

  const contentRules = [
    ['private-key-material', /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/u],
    ['google-private-key-json', /"private_key"\s*:\s*"(?!\s*")[^\n]+/u],
    ['aws-access-key-id', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/u],
    ['google-api-key', /\bAIza[0-9A-Za-z_-]{30,}\b/u],
  ];
  for (const [rule, pattern] of contentRules) {
    if (pattern.test(content)) violations.push({ file: normalized, rule });
  }

  if (
    normalized.startsWith('backend-remake/src/interface-adapters/http/') &&
    !normalized.endsWith('.spec.ts') &&
    /\b(?:legacyPasswordHash|passwordHash|sipPassword)\b/u.test(content)
  )
    violations.push({ file: normalized, rule: 'secret-field-in-http-adapter' });

  if (
    /(?:asterisk|voip)/iu.test(normalized) &&
    /password\s*:\s*["'][^"']+["']/iu.test(content)
  )
    violations.push({ file: normalized, rule: 'hard-coded-sip-password' });
  if (
    /initadmin/iu.test(normalized) &&
    /password\s*[:=]\s*["'][^"']+["']/iu.test(content)
  )
    violations.push({ file: normalized, rule: 'default-admin-password' });
}

const authController = resolve(
  repositoryRoot,
  'backend-remake/src/interface-adapters/http/auth/auth.controller.ts',
);
try {
  if (/@Post\(['"]register['"]\)/u.test(readFileSync(authController, 'utf8')))
    violations.push({
      file: relative(repositoryRoot, authController).replaceAll('\\', '/'),
      rule: 'public-self-registration-mounted',
    });
} catch {
  violations.push({
    file: 'backend-remake/src/interface-adapters/http/auth/auth.controller.ts',
    rule: 'auth-controller-missing',
  });
}

const persistenceGuardFiles = [
  'backend-remake/src/infrastructure/database/mongoose/auth/user.schema.ts',
  'backend-remake/src/infrastructure/database/mongoose/courses/course.schema.ts',
];
for (const persistenceGuardFile of persistenceGuardFiles) {
  const content = readFileSync(
    resolve(repositoryRoot, persistenceGuardFile),
    'utf8',
  );
  if (/@Prop\(\{\s*type:\s*String\s*\}\)\s*_id/u.test(content))
    violations.push({
      file: persistenceGuardFile,
      rule: 'string-persistence-id',
    });
}

const operationalUserFiles = [
  'backend-remake/src/domain/users/user.entity.ts',
  'backend-remake/src/infrastructure/database/mongoose/auth/user.schema.ts',
  'backend-remake/src/infrastructure/database/mongoose/auth/mongoose-user.repository.ts',
];
for (const operationalUserFile of operationalUserFiles) {
  const content = readFileSync(
    resolve(repositoryRoot, operationalUserFile),
    'utf8',
  );
  if (/\b(?:legacyPasswordHash|sipPassword)\b/u.test(content))
    violations.push({
      file: operationalUserFile,
      rule: 'legacy-secret-operational-field',
    });
}

const createCourseUseCase =
  'backend-remake/src/application/courses/create-course.use-case.ts';
if (
  /randomUUID/u.test(
    readFileSync(resolve(repositoryRoot, createCourseUseCase), 'utf8'),
  )
)
  violations.push({
    file: createCourseUseCase,
    rule: 'uuid-persistence-drift',
  });

if (violations.length > 0) {
  process.stderr.write(
    `Security scan failed (${repositoryScope ? 'repository' : 'backend-remake'} scope):\n`,
  );
  for (const violation of violations)
    process.stderr.write(`- ${violation.file}: ${violation.rule}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    `Security scan passed (${repositoryScope ? 'repository' : 'backend-remake'} scope, ${scannedFiles.length} files).\n`,
  );
}
