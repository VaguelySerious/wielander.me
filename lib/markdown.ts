import { Marked, type Tokens } from "marked";

const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/<[^>]+>/g, "")
		.replace(/&[a-z]+;|&#\d+;/g, "")
		.replace(/[^\p{L}\p{N}]+/gu, "-")
		.replace(/^-+|-+$/g, "");

// "- Name", "– Name" or "— Name" (Markdown often escapes the hyphen as "\-").
const ATTRIBUTION = /^\s*(?:\\?-|–|—)\s+/;

/**
 * Markdown for blog posts, with a few semantic upgrades:
 * - paragraphs with several hard line breaks render as verse, one span per
 *   line; consecutive stanzas are wrapped in <div class="poem">
 * - a blockquote whose last paragraph starts with a dash becomes a
 *   <figure> with the attribution in <figcaption>
 * - headings get ids and a hover anchor
 */
export function createMarkdown() {
	const md = new Marked({ gfm: true });
	md.use({
		renderer: {
			paragraph({ tokens }: Tokens.Paragraph) {
				const breaks = tokens.filter((t) => t.type === "br").length;
				const html = this.parser.parseInline(tokens);
				if (breaks >= 2) {
					const lines = html
						.split(/<br\s*\/?>\n?/)
						.map((l) => l.trim())
						.filter(Boolean)
						.map((l) => `<span class="line">${l}</span>`)
						.join("");
					return `<p class="verse">${lines}</p>\n`;
				}
				return `<p>${html}</p>\n`;
			},
			blockquote({ tokens }: Tokens.Blockquote) {
				const last = tokens[tokens.length - 1];
				if (
					tokens.length > 1 &&
					last?.type === "paragraph" &&
					ATTRIBUTION.test(last.raw)
				) {
					const body = this.parser.parse(tokens.slice(0, -1));
					const cite = this.parser
						.parseInline((last as Tokens.Paragraph).tokens)
						.replace(/^\s*(?:-|–|—|&#8211;|&#8212;)\s*/, "");
					return `<figure class="quote"><blockquote>${body}</blockquote><figcaption>${cite}</figcaption></figure>\n`;
				}
				return `<blockquote>${this.parser.parse(tokens)}</blockquote>\n`;
			},
			heading({ tokens, depth }: Tokens.Heading) {
				const html = this.parser.parseInline(tokens);
				const id = slugify(html);
				return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${html}</h${depth}>\n`;
			},
		},
	});
	return md;
}

const md = createMarkdown();

export function renderMarkdown(src: string): string {
	const html = md.parse(src, { async: false });
	// Group consecutive stanzas into one poem.
	return html.replace(
		/(?:<p class="verse">[\s\S]*?<\/p>\n)+/g,
		(stanzas) => `<div class="poem">${stanzas}</div>\n`,
	);
}
