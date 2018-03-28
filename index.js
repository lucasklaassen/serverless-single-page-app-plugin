'use strict';

const spawnSync = require('child_process').spawnSync;

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.commands = {
      syncToS3: {
        usage: 'Deploys the `app` directory to your bucket',
        lifecycleEvents: [
          'sync'
        ]
      }
    };

    this.hooks = {
      'syncToS3:sync': this.syncDirectory.bind(this)
    };
  }

  // syncs the `app` directory to the provided bucket
  syncDirectory() {
    const s3Bucket = this.serverless.variables.service.custom.s3Bucket;
    const s3BucketDirectory = this.serverless.variables.service.custom.s3BucketDirectory;
    const args = [
      's3',
      'sync',
      `${s3BucketDirectory}/`,
      `s3://${s3Bucket}/`,
      '--delete'
    ];
    const result = spawnSync('aws', args);
    const stdout = result.stdout.toString();
    const sterr = result.stderr.toString();
    if (stdout) {
      this.serverless.cli.log(stdout);
    }
    if (sterr) {
      this.serverless.cli.log(sterr);
    }
    if (!sterr) {
      this.serverless.cli.log('Successfully synced to the S3 bucket');
    }
  }
}

module.exports = ServerlessPlugin;