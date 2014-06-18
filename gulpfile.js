var gulp = require('gulp'),
    less = require('gulp-less');

var paths = {
  styles: ['src/styles/horn.less']
};

gulp.task('styles', function () {
  return gulp.src(paths.styles)
              .pipe(less())
              .pipe(gulp.dest('src/styles'))
});

gulp.task('watch', function () {
  gulp.watch('src/styles/*.less', ['styles']);
});

gulp.task('default', ['styles', 'watch']);
