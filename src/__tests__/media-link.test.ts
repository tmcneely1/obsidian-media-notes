import {
	normalizeMediaLink,
	getMediaLinkFromFrontmatter,
} from "../media-link";

const YT = "https://www.youtube.com/watch?v=eILVzTNWnq8";

describe("normalizeMediaLink", () => {
	it("passes through a plain http(s) url", () => {
		expect(normalizeMediaLink(YT)).toBe(YT);
		expect(normalizeMediaLink("http://example.com/a.mp3")).toBe(
			"http://example.com/a.mp3"
		);
	});

	it("trims surrounding whitespace", () => {
		expect(normalizeMediaLink(`  ${YT}  `)).toBe(YT);
	});

	it("unwraps the wrappers users put in frontmatter", () => {
		expect(normalizeMediaLink(`[[${YT}]]`)).toBe(YT);
		expect(normalizeMediaLink(`<${YT}>`)).toBe(YT);
		expect(normalizeMediaLink(`[watch](${YT})`)).toBe(YT);
		expect(normalizeMediaLink(`"${YT}"`)).toBe(YT);
		expect(normalizeMediaLink(`'${YT}'`)).toBe(YT);
	});

	it("drops a wikilink display alias", () => {
		expect(normalizeMediaLink(`[[${YT}|My Video]]`)).toBe(YT);
	});

	// These are the values that used to reach `new URL()` unguarded and throw,
	// which rejected onload and made Obsidian report "Failed to load plugin".
	it("returns undefined for values that are not absolute urls", () => {
		expect(normalizeMediaLink("eILVzTNWnq8")).toBeUndefined();
		expect(normalizeMediaLink("[[Some Note]]")).toBeUndefined();
		expect(normalizeMediaLink("youtube.com/watch?v=abc")).toBeUndefined();
		expect(normalizeMediaLink("")).toBeUndefined();
		expect(normalizeMediaLink("   ")).toBeUndefined();
	});

	it("rejects non-http protocols", () => {
		expect(normalizeMediaLink("file:///Users/me/a.mp4")).toBeUndefined();
		expect(
			normalizeMediaLink("javascript:alert(1)") // eslint-disable-line no-script-url
		).toBeUndefined();
		expect(normalizeMediaLink("obsidian://open?vault=x")).toBeUndefined();
	});

	it("returns undefined for non-string yaml values", () => {
		expect(normalizeMediaLink(undefined)).toBeUndefined();
		expect(normalizeMediaLink(null)).toBeUndefined();
		expect(normalizeMediaLink(42)).toBeUndefined();
		expect(normalizeMediaLink(true)).toBeUndefined();
		expect(normalizeMediaLink({ url: YT })).toBeUndefined();
		expect(normalizeMediaLink([YT])).toBeUndefined();
	});
});

describe("getMediaLinkFromFrontmatter", () => {
	it("reads media_link, then media", () => {
		expect(getMediaLinkFromFrontmatter({ media_link: YT })).toBe(YT);
		expect(getMediaLinkFromFrontmatter({ media: YT })).toBe(YT);
	});

	it("prefers media_link when both are usable", () => {
		expect(
			getMediaLinkFromFrontmatter({
				media_link: YT,
				media: "https://example.com/other",
			})
		).toBe(YT);
	});

	it("falls back to media when media_link is unusable", () => {
		expect(
			getMediaLinkFromFrontmatter({ media_link: "not a url", media: YT })
		).toBe(YT);
	});

	it("handles missing or empty frontmatter without throwing", () => {
		expect(getMediaLinkFromFrontmatter(undefined)).toBeUndefined();
		expect(getMediaLinkFromFrontmatter(null)).toBeUndefined();
		expect(getMediaLinkFromFrontmatter({})).toBeUndefined();
		expect(getMediaLinkFromFrontmatter({ title: "No media here" })).toBeUndefined();
	});
});
