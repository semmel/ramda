XYZ = node_modules/.bin/xyz --repo git@github.com:semmel/ramda.git --script scripts/prepublish --publish-command 'npm publish'


dist/ramda.js:
	npm run build:umd

dist/ramda.min.js:
	npm run build:umd:min


.PHONY: clean
clean:
	rm -f -- dist/ramda.js


.PHONY: lint
lint:


.PHONY: release-major release-minor release-patch
release-major release-minor release-patch:
	@$(XYZ) --increment $(@:release-%=%)


.PHONY: setup
setup:
	npm install


.PHONY: test
test: dist/ramda.js
	npm test
