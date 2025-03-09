const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const version = manifest.header.version.join('.');

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

const output = fs.createWriteStream(`dist/StompZone-Emojis-Next-v${version}.mcpack`);
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