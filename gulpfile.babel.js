const cp = require('child_process')
const del = require('del')
const gulp = require('gulp')
const gutil = require('gulp-util')
const sourcemaps = require('gulp-sourcemaps')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const browserSync = require('browser-sync').create()
const browserify = require('browserify')
const watchify = require('watchify')

const html = done => {
  cp.execFile('$(npm bin)/babel-node', ['prerender'], {
    stdio: 'inherit',
    shell: true,
  }, err => {
    if (err) gutil.log('prerender html', err)
    browserSync.reload()
    done()
  })
}

let isWatchifyEnabled = false

const js = () => {
  const bundler = browserify('src/js/index.js', {
    ...watchify.args,
    debug: true,
  })
    .transform('babelify')

  const bundle = () => bundler.bundle()
    .on('error', err => gutil.log('Browserify Error', err))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())

  if (isWatchifyEnabled) {
    const watcher = watchify(bundler)
    watcher.on('update', bundle)
    watcher.on('log', gutil.log)
  }

  return bundle()
}

const enableWatchJs = done => {
  isWatchifyEnabled = true
  done()
}

const watchJs = gulp.series(enableWatchJs, js)

const serve = done =>
  browserSync.init({
    server: 'dist',
    open: false,
  }, done)

const clean = () => del('dist')

const watch = done => {
  gulp.watch([
    'src/routes.json',
    'src/template.pug',
    'src/js/**/*.js',
  ], html)
  gulp.watch('src/js/**/*.js', js)

  done()
}

export const build = gulp.series(
  clean,
  gulp.parallel(html, js),
)

export default gulp.series(
  build,
  serve,
  watch,
)
