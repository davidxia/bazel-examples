// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const STATIC_FILES = [
  // BEGIN STATIC FILES
  TMPL_static_files,
  // END STATIC FILES
];

const BOOTSTRAP_FILES = [
  // BEGIN BOOTSTRAP FILES
  TMPL_bootstrap_files,
  // END BOOTSTRAP FILES
];

// Test + runtime entry point files
const BUNDLE_FILES = [
  // BEGIN TEST SPEC FILES
  TMPL_spec_files,
  // END TEST BUNDLE FILES
];

const BUNDLE_DIR = "TMPL_test_bundle_dir";
const ENTRY_BUNDLE_DIR = "TMPL_test_entry_bundle_dir";

function configureFiles(conf) {
  // Static files available but not included
  STATIC_FILES.forEach((f) => conf.files.push({ pattern: f, included: false }));

  // Bootstrap files included before spec files
  conf.files.push({
    pattern: `${ENTRY_BUNDLE_DIR}/*.js`,
    type: "module",
    included: true,
    watched: true,
    served: true,
  });
  conf.files.push({
    pattern: `${BUNDLE_DIR}/**/*.js`,
    type: "module",
    included: true,
    watched: true,
    served: true,
  });

  // Proxy simple URLs to the bazel resolved files
  // [...STATIC_FILES, ...BOOTSTRAP_FILES, ...BUNDLE_FILES].forEach((f) => {
  //   // In Windows, the runfile will probably not be symlinked. Se we need to
  //   // serve the real file through karma, and proxy calls to the expected file
  //   // location in the runfiles to the real file.
  //   const resolvedFile = runfiles.resolve(f);

  //   // Prefixing the proxy path with '/absolute' allows karma to load local
  //   // files. This doesn't see to be an official API.
  //   // https://github.com/karma-runner/karma/issues/2703
  //   conf.proxies["/base/" + f] = "/absolute" + resolvedFile;
  // });
}

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      // require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage/angular"),
      subdir: ".",
      reporters: [{ type: "html" }, { type: "text-summary" }],
    },
    reporters: ["progress", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true,
  });
  configureFiles(config);
};
