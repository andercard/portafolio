// iniciamos las dependencias de gulp
const gulp = require('gulp'),
      sass = require('gulp-sass'),
      browserSync = require('browser-sync'),
      reload      = browserSync.reload,
      notify = require("gulp-notify"),
      sassLint = require('gulp-sass-lint'),
      babel = require('gulp-babel'),
      concat = require('gulp-concat'),
      autoprefixer = require('gulp-autoprefixer'),
      uglify = require('gulp-uglify'),
      image = require('gulp-image'),
      rename = require('gulp-rename'),
      cleanCss = require('gulp-clean-css'),
      postcss = require('gulp-postcss'),
      uncss = require('gulp-uncss'),
      cssnano = require('gulp-cssnano'),
      plumber = require('gulp-plumber'),
      js_obfuscator = require('gulp-js-obfuscator')
      pump = require('pump');

// rutas
const ruta = {
        src: 'src',
        nm: 'node_modules'
      };

// archivos
const files= {
        css: [
          `./node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css`,
          `./node_modules/slick-carousel/slick/slick.css`
        ],
        js: [

          `./node_modules/jquery/dist/jquery.min.js`,
          `./node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js`,
          `./node_modules/slick-carousel/slick/slick.js`
        ],
        staticFont : [
          `./node_modules/slick-carousel/slick/fonts/*.*`,
          `./src/fonts/*.*`
        ]
      };

// configuracion
const  opts = {
        sass : {
          outputStyle: 'compressed'
        },
        es6 : { 
          presets : ['es2015','es2016','es2017']
        },
        autoprefixer : {
          browsers: ['last 2 version'],
          grid: true,
          cascade : false
        },
        rename: {
          suffix: '.min'
        },
        uglify: {
          compress: true
        },
        cleancss: {
          rebase: false
        },
        cssnano: {
          zindex: false
        }
      };


// Server
gulp.task('server', function() {
  var files = [
      './**/*.php',
      './**/*.html',
      './js/**/*.js'
      ];
  browserSync.init(files, {
        server: {
            baseDir: "./"
        }
  });
});

gulp.task( 'servidor', [ 'server'] );

// sass
gulp.task('sass', () => {
  gulp
    .src(`${ruta.src}/scss/**/*.scss`)
    .pipe(plumber())
    .pipe(sassLint())
    .pipe(sass(opts.sass))
    .pipe(rename(opts.rename))
    .pipe(cleanCss(opts.cleancss))
    .pipe(autoprefixer(opts.autoprefixer))
    .pipe(cssnano(opts.cssnano))
    .pipe(uncss({
        ignore: [
          ".ion-ios-arrow-back",
          ".proyectoTarjeta__sliderArrowBack",
          ".proyectoTarjeta__sliderArrowForward",
          ".ion-ios-arrow-forward"
        ],
        html: ["index.html"]
      }))
    .pipe(gulp.dest(`./css`))
    .pipe(reload({ stream: true }))
    .pipe(notify({
        message: '"sass" completo! <%= file.relative %>',
        onLast: true
      }));
});

// css
gulp.task('vendorcss', () => {
  gulp
    .src( files.css )
    .pipe( autoprefixer(opts.autoprefixer))
    .pipe( cleanCss(opts.cleancss))
    .pipe( concat( 'vendorcss.min.css' ) )
    .pipe( gulp.dest( `./css` ) )
    .pipe( notify( { message: 'vendor Css completo! <%= file.relative %>', onLast: true } ) )
});

gulp.task('css', ['sass', 'vendorcss']);

// js
gulp.task('scripts', (cb) =>{
  pump([
    gulp.src(`${ruta.src}/scripts/*.js`),
    babel( opts.es6 ),
    // concat('premium.min.js'),
    rename( opts.rename ),
    uglify({compress: true}),
    // js_obfuscator(),
    gulp.dest( `./js` ),
    notify({ message: 'es6 completo! <%= file.relative %>', onLast: true })
  ],
    cb
  )
});

gulp.task('vendorjs', (cb) =>{
  pump([
    gulp.src(files.js),
    concat('vendorjs.min.js'),
    // uglify( opts.uglify),
    gulp.dest( `./js` ),
    notify({ message: 'Vendor Js completo! <%= file.relative %>', onLast: true })
  ],
    cb
  )
});

gulp.task('js', ['scripts', 'vendorjs']);

// optimizar imagenes
gulp.task('image', function () {
  gulp
    .src(`${ruta.src}/images/**/*.+(png|jpg|jpeg|gif)`)
    .pipe(image())
    .pipe( gulp.dest(`./images`) )
});

//enviar archivos font
gulp.task('font', () => {
  gulp
    .src(files.staticFont)
    .pipe( gulp.dest( `./fonts`) );
});


gulp.task( 'revisar', [ 'sass', 'scripts' ], function () {
  gulp.watch( `${ruta.src}/scss/**/*.scss`, [ 'sass' ] );
  gulp.watch( `${ruta.src}/scripts/**/*.js`, [ 'scripts' ] );
});


gulp.task( 'default', [ 'css', 'js', 'server', 'revisar'] );