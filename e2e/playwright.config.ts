import {defineConfig, devices} from "@playwright/test";

const port = "48745";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
// eslint-disable-next-line no-restricted-syntax
export default defineConfig({
	testDir: "./",
	testMatch: /\.spec\.ts/,
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: Boolean(process.env.CI),
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	// reporter: process.env.CI ? ["junit", {outputFile: "e2e-report-junit.xml"}] : "junit",
	reporter: [["list"], ["junit", {outputFile: "../report-e2e.xml"}]],
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		// baseURL: 'http://127.0.0.1:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: {...devices["Desktop Chrome"]},
		},

		{
			name: "firefox",
			use: {...devices["Desktop Firefox"]},
		},

		{
			name: "webkit",
			use: {...devices["Desktop Safari"]},
		},

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: `yarn run vite ./e2e --port=${port} --strictPort`,
		url: `http://127.0.0.1:${port}`,
		reuseExistingServer: !process.env.CI,
	},
});
