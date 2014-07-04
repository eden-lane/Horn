var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat');

var paths = {
  styles: ['src/styles/horn.less'],
  modules: ['src/scripts/*/*.js']
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


gulp.task('default', ['styles', 'build', 'watch']);
