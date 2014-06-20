var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat');

var paths = {
  styles: ['src/styles/horn.less'],
  services: ['src/scripts/services/*.js']
};

gulp.task('styles', function () {
  return
    gulp.src(paths.styles)
      .pipe(less())
      .pipe(gulp.dest('src/styles'))
});

gulp.task('watch', function () {
  gulp.watch('src/styles/*.less', ['styles']);
});

gulp.task('build', function () {
  gulp.src(paths.services)
    .pipe(concat('services.js'))
    .pipe(gulp.dest('src/scripts'));
});

gulp.task('default', ['styles', 'watch']);
