import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import clean from 'gulp-clean';
import uglify from 'gulp-uglify';

const paths = {
    html: '*.html',
    css: [
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'css/style.css'
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
        .pipe(gulp.dest(paths.dist));
};

export const css = () => {
    return gulp.src(paths.css)
        .pipe(sourcemaps.init())
        .pipe(concat('styles.css'))
        .pipe(cleanCSS({
            level: 2,
            compatibility: 'ie8'
        }))
        .pipe(rename({ suffix: '.min' }))
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
        .pipe(gulp.dest(`${paths.dist}js`));
};

const build = gulp.series(cleanDist, gulp.parallel(html, css, js));

export default build;
