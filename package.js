Package.describe({
  name: "mizzao:turkserver",
  summary: "Framework for building online, real-time user experiments in Meteor",
  version: "0.0.0",
  git: "https://github.com/HarvardEconCS/turkserver-meteor.git"
});

Npm.depends({
  // mturk: "./mturk", // https://github.com/meteor/meteor/issues/1810
  // Currently using a fork in submodule; dependencies below
  "request": "2.30.0",
  "libxmljs": "0.8.1",
  "validator": "2.0.0",
  "querystring": "0.2.0",
  "async": "0.2.10",
  // End mturk dependencies
  deepmerge: "0.2.7" // For merging config parameters
});

Package.onUse(function (api) {
  api.versionsFrom("1.2.0.1");

  // Client-only deps
  api.use([
    'session',
    'ui',
    'templating',
    'reactive-var'
  ], 'client');

  // Client & Server deps
  api.use([
    'accounts-base',
    'accounts-ui',
    'accounts-password', // for the admin user
    'check',
    'deps',
    'ejson',
    'stylus',
    'jquery',
    'random',
    'underscore',
    'coffeescript',
    'ecmascript',
    'facts'
  ]);

  api.use(["ddp", "mongo"]); // For pub/sub and collections

  // Non-core packages
  api.use("aldeed:template-extension@3.4.3");

  api.use("mizzao:bootboxjs@4.4.0");
  api.use("iron:router@1.0.11");
  api.use("momentjs:moment@2.10.6");
  api.use("twbs:bootstrap@3.3.5");
  api.use("d3js:d3@3.5.5");

  api.use("mizzao:autocomplete@0.5.1");
  api.use('natestrauser:x-editable-bootstrap@1.5.2_1');

  // Dev packages - may be locally installed with submodule
  api.use("matb33:collection-hooks@0.7.15");
  api.use("mizzao:partitioner@0.5.8");
  api.use('mizzao:timesync@0.3.3');
  api.use("mizzao:user-status@0.6.5");

  // mturk fork
  api.addFiles([
    'mturk/index.js'
  ], 'server');

  // Shared files
  api.addFiles([
    'lib/common.js',
    'lib/common.coffee',
    'lib/util.coffee'
  ]);

  // Server files
  api.addFiles([
    'lib/config.js',
    'lib/turkserver.coffee',
    'lib/mturk.coffee',
    'lib/lobby_server.coffee',
    'lib/batches.coffee',
    'lib/instance.js',
    'lib/logging.coffee',
    'lib/assigners.coffee',
    'lib/assignment.js',
    'lib/connections.coffee',
    'lib/timers_server.js',
    'lib/accounts_mturk.coffee'
  ], 'server');

  // Client
  api.addFiles([
    'client/templates.html',
    'client/login.html',
    'client/client_api.js',
    'client/ts_client.styl',
    'client/ts_client.coffee',
    'client/login.coffee',
    'client/logging_client.coffee',
    'client/timers_client.coffee',
    'client/helpers.coffee',
    'client/lobby_client.html',
    'client/lobby_client.coffee',
    'client/dialogs.coffee'
  ], 'client');

  // Admin
  api.addFiles([
    'admin/admin.styl',
    'admin/util.html',
    'admin/util.coffee',
    'admin/clientAdmin.html',
    'admin/clientAdmin.coffee',
    'admin/mturkAdmin.html',
    'admin/mturkAdmin.coffee',
    'admin/experimentAdmin.html',
    'admin/experimentAdmin.coffee',
    'admin/lobbyAdmin.html',
    'admin/lobbyAdmin.coffee'
  ], 'client');

  api.addFiles('admin/admin.coffee', 'server');

  api.export(['TurkServer']);
  api.export(['ErrMsg', 'TestUtils'], { testOnly: true });
});

Package.onTest(function (api) {
  api.use([
    'accounts-base',
    'accounts-password',
    'check',
    'deps',
    'coffeescript',
    'mongo',
    'random',
    'ui',
    'underscore'
  ]);

  api.use([
    'tinytest',
    'test-helpers'
  ]);

  api.use('session', 'client');

  api.use('iron:router'); // Needed so we can un-configure the router
  api.use('mizzao:partitioner');
  api.use("mizzao:turkserver");
  api.use('mizzao:timesync');

  api.addFiles("tests/display_fix.css");

  api.addFiles('tests/utils.coffee'); // Deletes users so do it before insecure login
  api.addFiles("tests/insecure_login.js");

  api.addFiles('tests/lobby_tests.coffee');
  api.addFiles('tests/admin_tests.coffee', 'server');
  api.addFiles('tests/auth_tests.coffee', 'server');
  api.addFiles('tests/connection_tests.coffee', 'server');
  api.addFiles('tests/experiment_tests.coffee', 'server');
  api.addFiles('tests/experiment_client_tests.coffee');
  api.addFiles('tests/timer_tests.coffee', 'server');
  api.addFiles('tests/logging_tests.coffee');
  // This goes after experiment tests, so we can be sure that assigning works
  api.addFiles('tests/assigner_tests.coffee', 'server');

  // This runs after user is logged in, as it requires a userId
  api.addFiles('tests/helper_tests.coffee');
});
