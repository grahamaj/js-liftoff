const path = require('path');

const resolve = require('resolve');

const fileSearch = require('./file_search');
const silentRequire = require('./silent_require');

//Check baseDir for installed node module specified by name
exports.nodeModule = function (name, baseDir) {
  var modulePath, modulePackage;
  try {
    var delim = (process.platform === 'win32' ? ';' : ':'),
        paths = (process.env.NODE_PATH ? process.env.NODE_PATH.split(delim) : []);
    modulePath = resolve.sync(name, {basedir: baseDir, paths: paths});
    modulePackage = silentRequire(fileSearch('package.json', [modulePath]));
  } catch (e) {}
  if (modulePath) {
    return {
      path: modulePath,
      package: modulePackage
    };
  }
  return;
};

//Check baseDir for a package.json with the specified module name.
//If found assign the module path to the specified "main" file or index.js
exports.package = function (name, baseDir) {
  var modulePackage,
      modulePackagePath = fileSearch('package.json', [baseDir]);
  modulePackage = silentRequire(modulePackagePath);
  if (modulePackage && modulePackage.name === name) {
    return {
      path: path.join(path.dirname(modulePackagePath), modulePackage.main || 'index.js'),
      package: modulePackage
    };
  }
  return;
};
