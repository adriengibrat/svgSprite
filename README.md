# svgSprite.js

## Why?

* Using SVG can be tricky, so many ways to use SVG, styling limitations, CORS issues, bad browsers support, etc. svgSprite is a selection of the best hacks and techniques available.
* Handle inserted elements at any time, mandatory for [SPA](https://en.wikipedia.org/wiki/Single-page_application) and website injecting content in pages.
* Easiest way to migrate from webfont to SVG icons set, replacing any icon systems with SVG sprite without markup change.

## How?

By using a simple data-svg attribute in your markup:
```html
<i data-svg="icon-a"></i>…
<i data-svg="icon-z"></i>…
```
and a terse js API:
```javascript
svgSprite({source: 'https://example.com/assets/icons.svg'})
```
You'll get the SVG sprite injected in DOM and single SVGs pointing to SVG sprite symbols:
```html
<i data-svg="icon-a"><svg role="presentation"><use xlink:href="#icon-a"/></svg></i>…
<i data-svg="icon-z"><svg role="presentation"><use xlink:href="#icon-z"/></svg></i>…
<svg dispay="none" data-source="https://example.com/assets/icons.svg">
  <symbol id="icon-a">…</symbol>…
  <symbol id="icon-z">…</symbol>…
</svg>
```
Alternativelly, you can inline SVGs (using an external sprite) already in DOM:
```html
<svg><use xlink:href="https://example.com/assets/graphics.svg#logo"/></svg>…
<svg><use xlink:href="https://example.com/assets/graphics.svg#worldmap"/></svg>…
```
By simply calling:
```javascript
svgSprite.inline()
```
Again, you'll get single SVGs pointing to symbol in a unique inlined SVG sprite:
```html
<svg><use xlink:href="#logo"/></svg>…
<svg><use xlink:href="#worldmap"/></svg>…
<svg dispay="none" data-source="https://example.com/assets/graphics.svg">
  <symbol id="logo">…</symbol>…
  <symbol id="worldmap">…</symbol>…
</svg>
```

## Features

* Watch inserted nodes (looking for data-svg / SVG with external ressource), then inject or swap SVGs pointing to inlined sprite very efficiently (use events, no polling).
* Targets specifc 'elements' using a simple selector or a node list.
* Use as many SVG sprites as you want.
* Cache and deduplicate requests of external SVG sprites sources.
* Accepts URL and SVG markup sources, caching may be done with network and/or local storage.
* Use semantic and accessibility attributes to hide sprites and decorate injected / swapped SVGs.
* May be used at any time even before DOM is loaded.
* Allows advanced customization with a simple callback:
  * Specify 'viewbox' attribute to size and pad SVG symbols.
  * Keep short meaningful names in data-svg attribute with prefixed/suffixed ids in SVG sprite.
  * Rename / alias some elements in an symbol or icon set.
  * Use custom markup even without data-svg attribute.
* Zero dependencies.
* Only 1.6Kb minified & gzipped.
* UMD loader with named AMD definition included.

## Browser support

Targets evergreen browsers only, but successfully tested (some demo animation may not work thought) via [Browserling](https://www.browserling.com/) & [BrowserStack](https://www.browserstack.com) with Chrome 21+, Firefox 16+, IE 10+, Opera 16+, Safari 7.1, Safari iOS 9 & Android 4.4.

## Examples

Ugly [demo](https://adriengibrat.github.io/svgSprite) with helpful [commented sources](https://github.com/adriengibrat/svgSprite/blob/gh-pages/index.html).

## Installation

### NPM
```
npm i
```

### Quick & dirty CDN
```html
<script src="https://cdn.rawgit.com/adriengibrat/svgSprite/v1.1.26/svgSprite.min.js"></script>
```

### Old school

Download the [svgSprite.min.js](https://raw.githubusercontent.com/adriengibrat/svgSprite/master/svgSprite.min.js) file and add it to your project.

## API

### svgSprite()

```javascript
svgSprite({
	source: url || markup
	, elements: selector || collection // optional
	, before: function (svg, id, use, element, sprite, source) { // optional
		// 'svg' is the SVG element before it is injected
		// 'id' is the id used by default as fragment in xlink:href attribute (e.g. data-svg value)
		// 'use' is a utility function to optionaly change the SVG use tag xlink:href attribute
		// 'element' is the element where the SVG will be injected
		// 'sprite' is the SVG sprite already injected in DOM
		// 'source' is the source (URL or markup) of the SVG sprite

		// return false to avoid injecting the SVG in the element
	}
})
// returns a function (see below)
```

### svgSprite.inline()

```javascript
svgSprite.inline({
	elements: selector || collection // optional
	, before: function (svg, id, sprite, source) { // optional
		// 'svg' is the SVG element pointing to external resource
		// 'id' is the id used as fragment in xlink:href attribute
		// 'sprite' is the SVG sprite already injected in DOM
		// 'source' is the source URL of the SVG sprite

		// return false to avoid changing the SVG use tag xlink:href attribute
	}
})
// returns a function (see below)
```

#### returned callback

The function returned by `svgSprite()` and `svgSprite.inline()`
always returns the list of SVGs already processed.

N.B.: all process are async, the lists may contain null values:
* when the SVG is not injected yet (sprite load is pending).
* when the SVG or its use tag have been removed from DOM.
* when the SVG injection has been prevented (before() returning false).

```javascript
const done = svgSprite({ source: 'https://example.com/sprite.svg' }) // or svgSprite.inline()
…
// prevents new elements to be proccessed
done(true)
	// and remove all injected SVGs
	.forEach(svg => svg && svg.remove())
```

When 'elements' is not a collection, calling the function returned with a truthy argument
also pevents the new elements injected from being processed.

## Dev

### Install via npm

```
npm install
```

### Start bundling watch

```
npm start
```
### Check bundle size

```
npm run size
```

## Roadmap

* The demo needs a graphic designer, help wanted ;)
* Create a simple tool to generate  [SVG sprite with symbols & views](https://rawgit.com/adriengibrat/svgSprite/gh-pages/sprite.svg) that allow SVG external link, inlining, fragment identifiers to use as img src / css background, [nice previews](https://github.com/adriengibrat/svgSprite/blob/gh-pages/sprite.svg), [clean source](https://raw.githubusercontent.com/adriengibrat/svgSprite/gh-pages/sprite.svg), with easy symbol discovery and visualisation. 

## License

You may use this software under the [WTF Public License](http://www.wtfpl.net/txt/copying).

## Author

* Adrien Gibrat – <https://github.com/adriengibrat>

## Credits

Thanks to:

* [Jonathan Neal](https://github.com/jonathantneal)'s [svg4everybody](https://github.com/jonathantneal/svg4everybody) insprired me and was great source of useful information.
* [Iconic](https://useiconic.com) [SVGInjector](https://github.com/iconic/SVGInjector) for the cache & inject external SVG then swap elements lead.
* [Sara Soueidan](https://sarasoueidan.com)'s [great](http://tympanus.net/codrops/2015/07/16/styling-svg-use-content-css) [articles](https://sarasoueidan.com/tags/svg) about SVG, very detailed and inspiring.
* [Daniel Buchner](http://www.backalleycoder.com/about)'s [post](http://www.backalleycoder.com/2012/04/25/i-want-a-damnodeinserted) & [David Walsh](https://davidwalsh.name)'s [article](https://davidwalsh.name/detect-node-insertion) for, respectively, inventing & spreading great hacks.
* [Iconic Icons](https://useiconic.com/icons), [Material icons](https://design.google.com/icons), [Evil icons](http://evil-icons.io), [Fontastic icons](http://fontastic.me) & [Octicons](https://github.com/primer/octicons) used in the demo via [Jsdelivr](https://cdn.jsdelivr.net) & [Rawgit](https://rawgit.com).

## SVG sprite best practices

### Define viewBox

You should use [`symbol`](https://css-tricks.com/svg-symbol-good-choice-icons) tags and always define custom viewboxes:

```html
<symbol id="asset-id" viewBox="left top width height">
	<path …/> …
</symbol>
```

### Accessibility

You may add usefull descriptive tags and aria attributes.

```html
<defs role="presentation">
	<symbol id="asset-id" viewBox="left top width height" aria-labelledby="title">
		<title>Meaningful name</title>
		<path …/> …
	</symbol>
	<symbol id="another-id" viewBox="left top width height" aria-labelledby="title desc">
		<title>Another name</title>
		<desc>Longer description</desc>
		<path …/> …
	</symbol>
	…
</defs>
```

### SVG attributes

When inlined in HTML5 `xmlns` attributes are useless, but you should keep them on your sprite SVGs if they are consumed by another way (via css by example).

```html
<svg xmlns="http://www.w3.org/2000/svg"[ xmlns:xlink="http://www.w3.org/1999/xlink"]>
	…
</svg>
```

### Optimize SVG

Use the great [SVGO](https://github.com/svg/svgo) cli:

#### Install

`npm i -g svgo`

#### Basic usage

`svgo sprite.svg`

### Create SVG sprite

Thanks to [svg-sprite](https://github.com/jkphl/svg-sprite), it's quite simple:

#### Install

`npm i -g svg-sprite`

#### Basic usage

`svg-sprite --symbol --symbol-dest=. --symbol-sprite=sprite.svg svg/*.svg`
