install:
	pip3 install -r requirements.txt
	npm install

generate:
	python3 jaculusLibraries.py generate --compile-tailwind --verbose

serve:
	python3 jaculusLibraries.py serve

serve-no-livereload:
	python3 jaculusLibraries.py serve --port 8088 --no-livereload
