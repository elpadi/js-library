.PHONY: all check 

ES6 := $(shell find src/es6 -type f | sed 's,src/es6,dist,')

all: check $(ES6)

check:
	@which babel > /dev/null || ( echo "Babel is missing." && false )

dist/%.js: src/es6/%.js
	babel $^ -o $@
