var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat');

var paths = {
  styles: ['src/styles/horn.less'],
  services: ['src/scripts/services/*.js'],
  editor: [
    'src/scripts/editor/editor.js',
    'src/scripts/editor/cm.js',
    'src/scripts/editor/editorArea.js'
  ]
};

gulp.task('styles', function () {
    gulp.src(paths.styles)
      .pipe(less())
      .pipe(gulp.dest('src/styles'))
});

gulp.task('build.v2', function () {
  gulp.src(paths.editor)
    .pipe(concat('module.js'))
    .pipe(gulp.dest('src/scripts/editor'));
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
