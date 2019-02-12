const gulp = require("gulp");
const replace = require("gulp-replace");
const spawn = require("cross-spawn");
const chalk = require("chalk");
const log = require("fancy-log");
const parser = require("yargs-parser");
const toposort = require("toposort");
const _ = require("lodash");

const {taskRemoveSourceMapsMetadata, taskBuildSourceMapsListing} = require("./gulp/ng-sourcemaps");

const argv = parser(process.argv.slice(2), {
  configuration: {
    "camel-case-expansion": false,
    "short-option-groups": false,
    "duplicate-arguments-array": false,
  }
});

const passedArgs = Object.keys(argv)
  .filter(arg => arg !== "_")
  .map(arg => `--${arg}=${argv[arg]}`);


function runProcess(procName, args, cb) {
  log(chalk.gray(`${procName} ${args.join(" ")}`));

  const proc = spawn(procName, args);
  proc.stdout.on("data", (data) => console.log(data.toString()));
  proc.stderr.on("data", (data) => console.error(data.toString()));
  proc.on("close", (err) => cb(err));
  return proc;
}

function retrieveAssetsList() {
  const stats = require("./dist/stats.json");
  const entrypointChunkIds = _.chain(stats.entrypoints)
    .values()
    .flatMap(e => e.chunks)
    .uniq()
    .value();

  return _.chain(stats.chunks)
    .filter(c => entrypointChunkIds.includes(c.id))
    .flatMap(c => c.files)
    .uniq()
    .value();
}


gulp.task("build:ng", (cb) => {
  const options = ["build", "--prod", "--stats-json", "--source-map", ...passedArgs];
  runProcess("ng", options, cb);
});

gulp.task("build:ng-dev", (cb) => {
  const options = ["build", "--prod", "--stats-json", "--source-map", "--build-optimizer=false", "--vendor-chunk=false", ...passedArgs];
  runProcess("ng", options, cb);
});

gulp.task("build:workers", (cb) => {
  const options = ["run", "app:build-workers"];
  runProcess("ng", options, cb);
});

gulp.task("build:generate-nocache", () => {
  const assets = retrieveAssetsList()
    .map(f => `"${f}"`)
    .join(",");

  return gulp.src("src/bootstrap.nocache.js")
    .pipe(replace("/*GENERATED_SOURCES*/", assets))
    .pipe(gulp.dest("dist/"))
});

gulp.task("build:ng:sourcemaps", gulp.parallel(taskRemoveSourceMapsMetadata, taskBuildSourceMapsListing));

gulp.task("build", gulp.series("build:ng", "build:generate-nocache", "build:ng:sourcemaps", "build:workers"));
gulp.task("build:dev", gulp.series("build:ng-dev", "build:generate-nocache", "build:ng:sourcemaps", "build:workers"));
