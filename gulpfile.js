const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");

function css() {
	return gulp
		.src("src/scss/style.scss")
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				outputStyle: "compressed"
			}).on("error", sass.logError)
		)
		.pipe(autoprefixer())
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("dist/css"));
}

exports.default = gulp.series(css);
exports.css = css;
