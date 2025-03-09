const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function bumpVersion(version, type = 'patch') {
  const parts = version.split('.').map(Number);

  if (type === 'patch') {
    parts[2]++;
  } else if (type === 'minor') {
    parts[1]++;
    parts[2] = 0;
  } else if (type === 'major') {
    parts[0]++;
    parts[1] = 0;
    parts[2] = 0;
  }

  return parts.join('.');
}

const shouldBump = process.argv.includes('--bump');
const bumpType = process.argv.includes('--minor') ? 'minor' :
                process.argv.includes('--major') ? 'major' : 'patch';

const packageJsonPath = 'package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
let packageVersion = packageJson.version;

if (shouldBump) {
  const oldVersion = packageVersion;
  packageVersion = bumpVersion(packageVersion, bumpType);
  packageJson.version = packageVersion;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`Bumped version from ${oldVersion} to ${packageVersion}`);
}

const versionParts = packageVersion.split('.').map(Number);

const manifestPath = 'manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.header.version = versionParts;
manifest.modules[0].version = versionParts;

const versionPattern = /\[v§5(\d+\.\d+\.\d+)§r\]/;
manifest.header.description = manifest.header.description.replace(
  versionPattern,
  `[v§5${packageVersion}§r]`
);

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, '\t'));
console.log(`Updated manifest.json to version ${packageVersion}`);

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

const output = fs.createWriteStream(`dist/StompZone-Emojis-Next-v${packageVersion}.mcpack`);
const archive = archiver('zip', {
  zlib: { level: 0 }
});

output.on('close', function() {
  console.log(`Successfully created .mcpack file (${archive.pointer()} bytes)`);
});

archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

archive.file('manifest.json', { name: 'manifest.json' });
archive.file('pack_icon.png', { name: 'pack_icon.png' });
archive.directory('scripts/', 'scripts');

archive.finalize();