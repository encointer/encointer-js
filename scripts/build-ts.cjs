#!/usr/bin/env node

// Copyright 2017-2020 @polkadot/dev authors & contributors
// Copyright 2020 @encointer-js authors & contributors

const babel = require('@babel/cli/lib/babel/dir').default;
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const { EXT_CJS, EXT_ESM } = require('@polkadot/dev/config/babel-extensions.cjs');

const copySync = require('./copySync.cjs');
const execSync = require('./execSync.cjs');

const BL_CONFIGS = ['babel.config.js', 'babel.config.cjs'];
const WP_CONFIGS = ['webpack.config.js', 'webpack.config.cjs'];
const CPX = ['css', 'gif', 'hbs', 'jpg', 'js', 'json', 'png', 'svg', 'd.ts']
  .map((ext) => `src/**/*.${ext}`)
  .concat('package.json');

const isTypeModule = EXT_ESM === '.js';
const EXT_OTHER = isTypeModule ? EXT_CJS : EXT_ESM;

// compile via babel, either via supplied config or default
async function buildBabel (dir, type) {
    const configs = BL_CONFIGS.map((c) => path.join(process.cwd(), `../../${c}`));
    const outDir = path.join(process.cwd(), 'build');

    await babel({
        babelOptions: {
            configFile: type === 'esm'
                ? configs[0]
                : configs[1]
        },
        cliOptions: {
            extensions: ['.ts', '.tsx'],
            filenames: ['src'],
            ignore: '**/*.d.ts',
            outDir: outDir,
            outFileExtension: type === 'esm' ? EXT_ESM : EXT_CJS
        }
    });

    // rewrite a skeleton package.json with a type=module
    if (type !== 'esm') {
        [...CPX]
            .concat(`../../build/${dir}/src/**/*.d.ts`, `../../build/packages/${dir}/src/**/*.d.ts`)
            .forEach((src) => copySync(src, 'build'));
    }
}

// iterate through all the files that have been built, creating an exports map
function buildExports () {
  const buildDir = path.join(process.cwd(), 'build');
  const pkgPath = path.join(buildDir, 'package.json');
  const pkg = require(pkgPath);
  const list = findFiles(buildDir);

  if (!list.some(([key]) => key === '.')) {
    // for the env-specifics, add a root key (if not available)
    list.push(['.', {
      browser: createMapEntry(buildDir, pkg.browser)[1],
      node: createMapEntry(buildDir, pkg.main)[1],
      'react-native': createMapEntry(buildDir, pkg['react-native'])[1]
    }]);

    const indexDef = relativePath(pkg.main).replace('.js', '.d.ts');
    const indexKey = './index.d.ts';

    // additionally, add an index key, if not available
    if (!list.some(([key]) => key === indexKey)) {
      list.push([indexKey, indexDef]);
    }
  }

  pkg.exports = list
      .sort((a, b) => a[0].localeCompare(b[0]))
      .reduce((all, [path, config]) => ({
        ...all,
        [path]: typeof config === 'string'
            ? config
            : {
              ...((pkg.exports && pkg.exports[path]) || {}),
              ...config
            }
      }), {});
  pkg.type = isTypeModule
      ? 'module'
      : 'commonjs';

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

// find the names of all the files in a certain directory
function findFiles (buildDir, extra = '') {
  const currDir = extra ? path.join(buildDir, extra) : buildDir;

  return fs
      .readdirSync(currDir)
      .reduce((all, jsName) => {
        const jsPath = `${extra}/${jsName}`;
        const thisPath = path.join(buildDir, jsPath);
        const toDelete = jsName.includes('.spec.') || // no tests
            jsName.endsWith('.d.js') || // no .d.ts compiled outputs
            jsName.endsWith(`.d${EXT_OTHER}`) || // same as above, esm version
            (
                jsName.endsWith('.d.ts') && // .d.ts without .js as an output
                !fs.existsSync(path.join(buildDir, jsPath.replace('.d.ts', '.js')))
            );

        if (toDelete) {
          fs.unlinkSync(thisPath);
        } else if (fs.statSync(thisPath).isDirectory()) {
          findFiles(buildDir, jsPath).forEach((entry) => all.push(entry));
        } else if (!jsName.endsWith(EXT_OTHER) || !fs.existsSync(path.join(buildDir, jsPath.replace(EXT_OTHER, '.js')))) {
          // this is not mapped to a compiled .js file (where we have dual esm/cjs mappings)
          all.push(createMapEntry(buildDir, jsPath));
        }

        return all;
      }, []);
}

// creates an entry for the cjs/esm name
function createMapEntry (rootDir, jsPath) {
  jsPath = relativePath(jsPath);

  const otherPath = jsPath.replace('.js', EXT_OTHER);
  const otherReq = isTypeModule ? 'require' : 'import';
  const field = otherPath !== jsPath && fs.existsSync(path.join(rootDir, otherPath))
      ? {
        [otherReq]: otherPath,
        // eslint-disable-next-line sort-keys
        default: jsPath
      }
      : jsPath;

  if (jsPath.endsWith('.js')) {
    if (jsPath.endsWith('/index.js')) {
      return [jsPath.replace('/index.js', ''), field];
    } else {
      return [jsPath.replace('.js', ''), field];
    }
  }

  return [jsPath, field];
}

function relativePath (value) {
  return `${value.startsWith('.') ? value : './'}${value}`.replace(/\/\//g, '/');
}

async function main () {
  execSync('yarn polkadot-dev-clean-build');

  process.chdir('packages');
  execSync('yarn polkadot-exec-tsc --emitDeclarationOnly --outdir ./build');

  const dirs = fs
    .readdirSync('.')
    .filter((dir) => fs.statSync(dir).isDirectory() && fs.existsSync(path.join(process.cwd(), dir, 'src')));

  for (const dir of dirs) {
    process.chdir(dir);

    const { name, version } = require(path.join(process.cwd(), './package.json'));

    console.log(`*** ${name} ${version}`);

    mkdirp.sync('build');

    await buildBabel(dir, 'cjs');
    await buildBabel(dir, 'esm');
    buildExports();

    console.log();

    process.chdir('..');
  }

  process.chdir('..');
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
