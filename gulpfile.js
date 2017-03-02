const gulp = require('gulp');
const stylus = require('gulp-stylus');
const stylint = require('gulp-stylint');
const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename");
const cssnano = require('gulp-cssnano');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const pump = require('pump');
var banner = require("gulp-banner");
var pkg = require('./package.json');


var comment = '/**!\n' +
    ' * <%= pkg.name %> <%= pkg.version %>\n' +
    ' * <%= pkg.description %>\n' +
    ' * <%= pkg.homepage %>\n' +
    ' *\n' +
    ' * Copyright © 2015-'+new Date().getFullYear() + ' <%= pkg.author.name %>\n' +
    ' * Free to use under the MIT license.\n ' +
    '*/\n\n';

gulp.task('compress', () => {
  return gulp.src('src/responsivelyLazy.bundle.js')
          .pipe(sourcemaps.init())
          .pipe(uglify({
            beautify: false,
            mangle: {
              screw_ie8: true,
              keep_fnames: true
            },
            compress: {
              warnings: true,
              screw_ie8: true,
              conditionals: true,
              unused: true,
              comparisons: true,
              sequences: true,
              dead_code: true,
              evaluate: true,
              join_vars: true,
              if_return: true
            },
            comments: false
          }))
          .pipe(rename('responsivelyLazy.min.js'))
          .pipe(banner(comment, {
            pkg: pkg
          }))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest('./'));
});

gulp.task('babel', () => {
    return gulp.src('src/responsivelyLazy.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('responsivelyLazy.bundle.js'))
        .pipe(gulp.dest('./src'));
});

// Get one .styl file and render
gulp.task('build:css:prod', function () {
  return gulp.src('./src/responsivelyLazy.styl')
    .pipe(stylint())
    .pipe(stylint.reporter())
    .pipe(stylus({
      'include css': true,
      'disable cache': true
    }))
    .pipe(rename('responsivelyLazy.min.css'))
    .pipe(sourcemaps.init())
    .pipe(cssnano({
      reduceIdents: false,
      discardDuplicates: true,
      discardComments: {
        removeAll: true
      },
      autoprefixer: {
        add: true,
        browsers: ['> 1%', 'last 2 versions'],
        cascade: false
      },
      zindex: false
    }))
    .pipe(banner(comment, {
      pkg: pkg
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./'));
});

gulp.task('build:css:dev', function () {
  return gulp.src('./src/responsivelyLazy.styl')
    .pipe(stylus({
      compress: false,
      'include css': true,
      'disable cache': true
    }))
    .pipe(rename('responsivelyLazy.css'))
    .pipe(banner(comment, {
      pkg: pkg
    }))
    .pipe(gulp.dest('./'));
});

// Get one .styl file and render
gulp.task('lint', function () {
  return gulp.src('./src/responsivelyLazy.styl')
    .pipe(stylint())
    .pipe(stylint.reporter());
});

gulp.task('default', ['lint', 'build:css:dev']);
gulp.task('build:js', ['babel', 'compress']);
