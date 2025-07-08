const {src, dest, series, watch} = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-imagemin');
const del = require('del');
const newer = require('gulp-newer');

const clean = () => {
    return del(['dist'])
}

const pugToHtml = () => {
    return src(['src/**/*.pug', '!src/**/__*.pug'])
      .pipe(pug({pretty: true}))
      .pipe(dest('dist'))
      .pipe(browserSync.stream())
}

const sassToCss = () => {
    return src(['src/sass/**/*.scss', '!src/sass/**/__*.scss'])
      .pipe(sass({ outputStyle: 'expanded'}))
      .pipe(dest('dist/css'))
      .pipe(browserSync.stream())
}

const deliverJs = () => {
  return src('src/js/**/*.js')
      .pipe(dest('dist/scripts'))
      .pipe(browserSync.stream())
}

const doImages = () => {
  return src('src/images/**/*.{jpg,jpeg,png}', { encoding: false })
    .pipe(newer('dist/img'))
    .pipe(image([
      image.optipng({ optimizationLevel: 5 }),
    ]))
    .pipe(dest('dist/img'))
    .pipe(browserSync.stream());
};

const doSvg = () => {
  return src('src/images/svg/**.svg')
    .pipe(newer('dist/img/sprite.svg'))
    .pipe(svgSprite({ 
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }))
    .pipe(dest('dist/img'))
    .pipe(browserSync.stream());
}

const deliverFonts = () => {
  return src('src/fonts/**/*.{woff,woff2,ttf,otf}')
    .pipe(dest('dist/fonts'));
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })

  watch('src/**/*.pug', pugToHtml);
  watch('src/sass/**/*.scss', sassToCss);
  watch('src/js/**/*.js', deliverJs);
  watch('src/images/**/*.{jpg,jpeg,png,gif,webp}', doImages);
  watch('src/images/svg/**.svg', doSvg);
  watch('src/fonts/**/*.{woff,woff2,ttf,otf}', deliverFonts)
}

exports.default = series(clean, pugToHtml, sassToCss, deliverJs, doImages, doSvg, deliverFonts, watchFiles);