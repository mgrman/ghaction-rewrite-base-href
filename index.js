const core = require('@actions/core');
const fs = require('fs');

try {
  const htmlPath = core.getInput('html_path');
  const target404Path = core.getInput('root_path')+`/404.html`;
  const baseHref = core.getInput('base_href');
  
  const redirectJs = fs.readFileSync('redirect_js.html', 'utf8');
  const source404 = fs.readFileSync('404.html', 'utf8');
  
  console.log(`Attempting to rewrite base href in '${htmlPath}' to value '${baseHref}'...`);

  const originalText = fs.readFileSync(htmlPath, 'utf8');
  const updatedText = originalText
    .replace(/<base ([^>]*href=["'])([^'"]*)(["'][^>]*)>/, `<base $1${baseHref}$3>`)
    .replace('</head>', redirectJs+'</head>');

  if (originalText !== updatedText) {
    fs.writeFileSync(htmlPath, updatedText);
    console.log('Done');  
  } else {
    console.warn(`WARNING: no <base> tag with 'href' attribute was found in '${htmlPath}'.`);
  }
  
  
  fs.writeFileSync(target404Path, source404);
  
  
} catch (error) {
  core.setFailed(error.message);
}
