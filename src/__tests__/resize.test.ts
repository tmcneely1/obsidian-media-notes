import {
	computePlayerPercent,
	clampPlayerPercent,
	MIN_PLAYER_PERCENT,
	MAX_PLAYER_PERCENT,
} from "../resize";

describe("computePlayerPercent", () => {
	it("converts a pointer offset into a percentage of the container", () => {
		expect(computePlayerPercent(500, 1000)).toBe(50);
		expect(computePlayerPercent(250, 1000)).toBe(25);
		expect(computePlayerPercent(800, 1000)).toBe(80);
	});

	it("clamps instead of letting a drag collapse either pane", () => {
		// dragged to the far left / top
		expect(computePlayerPercent(0, 1000)).toBe(MIN_PLAYER_PERCENT);
		expect(computePlayerPercent(-400, 1000)).toBe(MIN_PLAYER_PERCENT);
		// dragged past the far right / bottom
		expect(computePlayerPercent(1000, 1000)).toBe(MAX_PLAYER_PERCENT);
		expect(computePlayerPercent(5000, 1000)).toBe(MAX_PLAYER_PERCENT);
	});

	it("returns null when the container has no size yet", () => {
		// a pane that has not been laid out would otherwise divide by zero
		expect(computePlayerPercent(100, 0)).toBeNull();
		expect(computePlayerPercent(100, -50)).toBeNull();
	});

	it("returns null for non-finite input rather than writing NaN% to style", () => {
		expect(computePlayerPercent(NaN, 1000)).toBeNull();
		expect(computePlayerPercent(100, NaN)).toBeNull();
		expect(computePlayerPercent(Infinity, 1000)).toBeNull();
	});
});

describe("clampPlayerPercent", () => {
	it("leaves values inside the usable range alone", () => {
		expect(clampPlayerPercent(50)).toBe(50);
		expect(clampPlayerPercent(MIN_PLAYER_PERCENT)).toBe(MIN_PLAYER_PERCENT);
		expect(clampPlayerPercent(MAX_PLAYER_PERCENT)).toBe(MAX_PLAYER_PERCENT);
	});

	it("pulls out-of-range values back to the bounds", () => {
		expect(clampPlayerPercent(0)).toBe(MIN_PLAYER_PERCENT);
		expect(clampPlayerPercent(100)).toBe(MAX_PLAYER_PERCENT);
	});
});
