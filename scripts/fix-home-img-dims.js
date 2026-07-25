/**
 * Add width/height to index.html imgs missing dimensions (CLS).
 */
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

const rules = [
  {
    find: /(<img\s+src="https:\/\/images\.unsplash\.com\/[^"]+w=1920[^"]*"\s+alt="[^"]*"\s+loading="lazy"\s*\/>)/g,
    dims: ' width="1920" height="1080" decoding="async"',
  },
  {
    find: /(<img\s+src="https:\/\/images\.unsplash\.com\/[^"]+w=1400[^"]*"\s+alt="[^"]*"\s+loading="lazy"\s*\/>)/g,
    dims: ' width="1400" height="788" decoding="async"',
  },
  {
    find: /(<img\s+src="https:\/\/images\.unsplash\.com\/[^"]+w=1200[^"]*"\s+alt="[^"]*"\s+loading="lazy"\s*\/>)/g,
    dims: ' width="1200" height="675" decoding="async"',
  },
  {
    find: /(<img\s+src="https:\/\/images\.unsplash\.com\/[^"]+w=1000[^"]*"\s+alt="[^"]*"\s+loading="lazy"\s*\/>)/g,
    dims: ' width="1000" height="667" decoding="async"',
  },
  {
    find: /(<img\s+src="https:\/\/images\.unsplash\.com\/[^"]+w=120[^"]*"\s+alt="[^"]*"\s+loading="lazy"\s*\/>)/g,
    dims: ' width="120" height="120" decoding="async"',
  },
];

// Multiline unsplash slides
html = html.replace(
  /(<img\s*\n\s*src="https:\/\/images\.unsplash\.com\/[^"]+w=1920[^"]*"\s*\n\s*alt="[^"]*"\s*\n\s*loading="lazy"\s*\n\s*\/>)/g,
  (m) => m.replace('loading="lazy"', 'width="1920" height="1080" loading="lazy" decoding="async"')
);

html = html.replace(
  /(<img class="logo-image" src="\/logo\.png" alt="[^"]*"\s*\/>)/g,
  '<img class="logo-image" src="/logo.png" alt="Logo Minh Tuấn" width="160" height="56" />'
);
html = html.replace(
  /(<img class="logo-image footer-logo-image" src="\/logo\.png" alt="[^"]*"\s*\/>)/g,
  '<img class="logo-image footer-logo-image" src="/logo.png" alt="Logo Minh Tuấn" width="148" height="90" />'
);
html = html.replace(
  /(<img class="logo-image why-radial-logo" src="\/logo\.png" alt="[^"]*"\s*\/>)/g,
  '<img class="logo-image why-radial-logo" src="/logo.png" alt="Logo Minh Tuấn" width="120" height="72" />'
);
html = html.replace(
  /(<img class="page-loader-plane" src="\/logo-plane\.png" alt=""\s*\/>)/g,
  '<img class="page-loader-plane" src="/logo-plane.png" alt="" width="340" height="218" />'
);

for (const { find, dims } of rules) {
  html = html.replace(find, (m) => {
    if (/width=/.test(m)) return m;
    return m.replace(/\s*\/>$/, dims + " />");
  });
}

fs.writeFileSync("index.html", html);
console.log("index.html image dimensions updated");
