// Player size is stored as a percentage of its container rather than as pixels,
// so a size chosen once survives window resizes, split changes and other notes.

// Keep the player usable at either extreme: never let a drag collapse it to
// nothing or squeeze the note out of view.
export const MIN_PLAYER_PERCENT = 15;
export const MAX_PLAYER_PERCENT = 85;

export const clampPlayerPercent = (pct: number): number =>
	Math.min(MAX_PLAYER_PERCENT, Math.max(MIN_PLAYER_PERCENT, pct));

/**
 * Convert a pointer position into a clamped player size, as a percentage of the
 * container. `offset` is the distance from the container's leading edge (left in
 * vertical split, top in horizontal), `total` the container's size on that axis.
 * Returns null when the container has no size yet, so callers can skip the drag
 * rather than divide by zero.
 */
export const computePlayerPercent = (
	offset: number,
	total: number
): number | null => {
	if (!Number.isFinite(offset) || !Number.isFinite(total) || total <= 0) {
		return null;
	}
	return clampPlayerPercent((offset / total) * 100);
};
