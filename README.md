# "Works on Windows on Arm" website git repository

This repository is used to build `staging.worksonwoa.com` and, from there, `www.worksonwoa.com`.

The websites are built automatically when the staging and main branches are updated, as appropriate.

The staging branch is updated by:

- Forking this repository
- Making the changes you want to make
- Raising a pull request against the staging branch
- Waiting for a repository maintainer to review and approve your changes

Once the pull request is approved, your changes will be merged to the staging branch and published to staging.worksonwoa.com.

A repository maintainer can then merge all changes from staging to main in order to cause the main website to be updated and rebuilt.

## Contributing

Details of the schemas used in the application, game and user report files can be found by reading https://www.worksonwoa.com/en/contributing

## Questions?

If you have any questions about updating or building this website, please contact Linaro IT Support at [it-support@linaro.org](mailto:it-support@linaro.org).

## Developer Info

Running the site locally will require `Node.js` and the `yarn` package manager.

Install dependencies with `yarn install` then, to run the site locally, run `yarn start:build`. Press CTRL+C to stop the local web server when you have finished.
Start script may require additional flags: `NODE_OPTIONS=--experimental-wasm-modules IS_PUBLIC=true`

