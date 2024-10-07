import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import clean from 'gulp-clean';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import sass from 'gulp-dart-sass';

const server = browserSync.create();

const paths = {
    html: '*.html',
    sass: 'scss/*.scss',
    css: [
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
    ],
    js: 'js/*.js',
    dist: 'dist/'
};

export const cleanDist = () => {
    return gulp.src(paths.dist, { read: false, allowEmpty: true })
        .pipe(clean());
};

export const html = () => {
    return gulp.src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.dist))
        .pipe(server.stream());
};

export const sassTask = () => {
    return gulp.src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            sourceMap: true,
            silenceDeprecations: ['legacy-js-api'],
        }).on('error', sass.logError))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${paths.dist}css`))
        .pipe(server.stream());
};

export const css = () => {
    return gulp.src(paths.css)
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({ level: 2, compatibility: 'ie8' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${paths.dist}css`))
};

export const js = () => {
    return gulp.src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${paths.dist}js`))
        .pipe(server.stream());
};

export const serve = () => {
    server.init({
        server: {
            baseDir: paths.dist
        },
        notify: false
    });

    gulp.watch(paths.html, html);
    gulp.watch(paths.sass, sassTask);
    gulp.watch(paths.js, js);
};

const build = gulp.series(cleanDist, gulp.parallel(html, sassTask, css, js), serve);

export default build;
