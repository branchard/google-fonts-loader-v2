import "isomorphic-fetch";
import {afterEach, describe, expect, test} from "@jest/globals";
import {load} from "../src";
import {registry} from "../src/registry";

describe("load()", () => {
	afterEach(() => {
		document.head.innerHTML = "";
		registry.clear();
	});

	test("should load Open Sans with multiple tuples", () => {
		load({
			family: "Open Sans",
			axisTupleList: [
				[
					{tag: "ital", value: 0},
					{tag: "wght", value: 200},
				],
				[
					{tag: "ital", value: 1},
					{tag: "wght", value: 200},
				],
				[
					{tag: "ital", value: 0},
					{tag: "wght", value: 500},
				],
				[
					{tag: "ital", value: 1},
					{tag: "wght", value: 500},
				],
			],
		}, {
			display: "swap",
		});

		expect(document.head.querySelector<HTMLLinkElement>(".google-fonts-loader-v2")?.href)
			.toBe("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,200;0,500;1,200;1,500&display=swap");
	});

	test("should append tuples to already created URL and deduplicate them", () => {
		load({
			family: "Open Sans",
			axisTupleList: [
				[
					{tag: "ital", value: 0},
					{tag: "wght", value: 200},
					{tag: "wdth", value: 75},
				],
				[
					{tag: "ital", value: 1},
					{tag: "wght", value: 200},
					{tag: "wdth", value: 75},
				],
				[
					{tag: "ital", value: 0},
					{tag: "wght", value: 500},
					{tag: "wdth", value: 75},
				],
				[
					{tag: "ital", value: 1},
					{tag: "wght", value: 500},
					{tag: "wdth", value: 75},
				],
			],
		}, {
			display: "swap",
		});

		expect(document.head.querySelector<HTMLLinkElement>(".google-fonts-loader-v2")?.href)
			.toBe("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wdth,wght@0,75,200;0,75,500;1,75,200;1,75,500&display=swap");

		load({
			family: "Open Sans",
			axisTupleList: [
				[
					{tag: "ital", value: 0},
					{tag: "wght", value: 800},
					{tag: "wdth", value: 80},
				],
				[
					{tag: "ital", value: 0},
					{tag: "wght", value: 500},
					{tag: "wdth", value: 75},
				],
			],
		}, {
			display: "swap",
		});

		expect(document.head.querySelector<HTMLLinkElement>(".google-fonts-loader-v2")?.href)
			.toBe("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wdth,wght@0,75,200;0,75,500;0,80,800;1,75,200;1,75,500&display=swap");
	});

	test("should respond HTTP 200 when requesting the Google Fonts API", async () => {
		load({
			family: "Open Sans",
			axisTupleList: [
				[
					{tag: "ital", value: 0},
					{tag: "wght", value: 800},
					{tag: "wdth", value: 80},
				],
				[
					{tag: "ital", value: 0},
					{tag: "wght", value: 500},
					{tag: "wdth", value: 75},
				],
			],
		}, {
			display: "swap",
		});

		const response = await fetch(document.head.querySelector<HTMLLinkElement>(".google-fonts-loader-v2")!.href);
		expect(response.status).toBe(200);
	});
});
