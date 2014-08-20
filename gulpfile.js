var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    zip = require('gulp-zip');

var paths = {
  styles: ['src/styles/horn.less'],
  modules: ['src/scripts/*/*.js'],
  app: [
    'src/templates/*',
    'src/styles/horn.css',
    'src/styles/kirin.css',
    'src/styles/icomoon.css',
    'src/styles/fonts/*',
    'src/scripts/*.js',
    'src/scripts/**/*.html',
    'src/img/*',
    'src/components/codemirror/**/*',
    'src/components/ngDialog/js/ngDialog.js',
    'src/components/ngDialog/css/ngDialog-theme-default.css',
    'src/components/ngDialog/css/ngDialog-theme-plain.css',
    'src/components/ngDialog/css/ngDialog.css',
    'src/components/angular/angular.js',
    'src/components/angular-sanitize/angular-sanitize.js',
    'src/components/lodash/dist/lodash.min.js',
    'src/components/marked/lib/marked.js',
    'src/components/siftjs/sift.min.js',
    'src/components/keymaster/keymaster.js',
    'src/window.html',
    'src/background.js',
    'src/manifest.json'
  ]
};

/**
 * Compiling LESS styles
 */
gulp.task('styles', function () {
    gulp.src(paths.styles)
      .pipe(less())
      .pipe(gulp.dest('src/styles'))
});

/**
 * Combining all modules in one file
 */
gulp.task('build', function () {
  gulp.src(paths.modules)
    .pipe(concat('module.js'))
    .pipe(gulp.dest('src/scripts/'));
});

/**
 * Watch changes and rebuild files
 */
gulp.task('watch', function () {
  gulp.watch('src/styles/*.less', ['styles']);
  gulp.watch(['src/scripts/*/*.js'], ['build']);
});

gulp.task('compile', function () {
  gulp.src(paths.app, {base: './src'})
    .pipe(zip('app.zip'))
    .pipe(gulp.dest('dist'));
});


gulp.task('default', ['styles', 'build', 'watch']);
