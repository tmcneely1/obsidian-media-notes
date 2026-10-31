// Strips the wrappers users commonly end up with in frontmatter -- wikilinks,
// angle brackets, markdown links and stray quotes -- then verifies the result is
// an http(s) URL. Returns undefined for anything unusable so callers can bail out
// instead of letting `new URL()` throw. See getMediaLinkFromFrontmatter.
export const normalizeMediaLink = (value: unknown): string | undefined => {
	if (typeof value !== "string") return undefined;
	let link = value.trim();
	if (!link) return undefined;

	// [[https://...]] or [https://...](https://...)
	const wikilink = link.match(/^\[\[([\s\S]+)\]\]$/);
	if (wikilink) link = wikilink[1].trim();
	const mdlink = link.match(/^\[[^\]]*\]\(([\s\S]+)\)$/);
	if (mdlink) link = mdlink[1].trim();
	// <https://...>
	const angled = link.match(/^<([\s\S]+)>$/);
	if (angled) link = angled[1].trim();
	// leftover surrounding quotes
	link = link.replace(/^["']|["']$/g, "").trim();
	// a wikilink may carry a display alias: [[url|label]]
	const pipe = link.indexOf("|");
	if (pipe !== -1) link = link.slice(0, pipe).trim();

	if (!link) return undefined;

	try {
		const url = new URL(link);
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			return undefined;
		}
		return link;
	} catch {
		return undefined;
	}
};

export const getMediaLinkFromFrontmatter = (
	frontmatter: Record<string, unknown> | null | undefined
): string | undefined => {
	if (!frontmatter) return undefined;
	return (
		normalizeMediaLink(frontmatter["media_link"]) ??
		normalizeMediaLink(frontmatter["media"])
	);
};
