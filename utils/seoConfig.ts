// Type imports
import type { ManifestOptions } from "vite-plugin-pwa"

/**
 * Defines the default SEO configuration for the website.
 */
/* export const seoConfig = {
	baseURL: "https://ozze.eu.org", // Change this to your production URL.
	description:
		"", // Change this to be your website's description.
	type: "website",
	image: {
		url: "https://picsum.photos/1200/630", // Change this to your website's thumbnail.
		alt: "OpenGraph thumbnail description.", // Change this to your website's thumbnail description.
		width: 1200,
		height: 630
	},
	siteName: "Åzzen Nettisivut.", // Change this to your website's name,
	twitter: {
		card: "summary_large_image"
	}
} */

/**
 * Defines the configuration for PWA webmanifest.
 */
export const manifest: Partial<ManifestOptions> = {
	name: "Åzzen nettisivut", // Change this to your website's name.
	short_name: "Åzze", // Change this to your website's short name.
	description:
		"Astro PWA Starter is an opionated Astro starter for building robust static websites.", // Change this to your websites description.
	theme_color: "#30E130", // Change this to your primary color.
	background_color: "#ffffff", // Change this to your background color.
	display: "minimal-ui",
	icons: [
		{
			src: "/favicon.svg",
			sizes: "512x512",
			type: "image/svg"
		},
		{
			src: "/favicons/favicon-512x512.png",
			sizes: "512x512",
			type: "image/svg",
			purpose: "any maskable"
		}
	]
}