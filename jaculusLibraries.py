import os
import click
import json
from src.generate_web import GenerateWeb
from src.generate_manifest import GenerateManifest
from pprint import pprint
from time import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@click.group()
def cli():
    pass

@click.command(help='Generate web from files')
@click.option('--library-dir', default='libraries', help='Library directory (default is libraries)')
@click.option('--static-dir', default='static', help="Static directory (default is 'static')")
@click.option('--template-dir', '-t', default='templates', help="Template directory (default is 'templates')")
@click.option('--build-dir', '-o', default='build', help='build directory (default is build)')
@click.option('--verbose', default=False, is_flag=True, help='Verbose build')
@click.option('--compile-tailwind', default=False, is_flag=True, help='Compile tailwind (requires npx + tailwindcss)')
def generate(library_dir: str,static_dir: str, template_dir: str, build_dir: str, verbose: bool, compile_tailwind: bool):
    print(f"Generating web to {build_dir} directory")
    start = time()

    manifest = GenerateManifest(library_dir,verbose)

    with open(f'package.json', 'r') as f:
        package_json:dict = json.loads(f.read())
        print(f"Read package.json")
        _repository:str = package_json["repository"]
        _repository = _repository.replace("git@github.com:", "")
        user:str = _repository.split("/")[0]
        repo:str = _repository.split("/")[1].replace(".git", "")

    # with open(f'static/CNAME', 'r') as f:
    #     _cname:str = f.read()
    #     _cname = _cname.replace("\n", "")
    _cname = "https://c2coder.github.io/Jaculus-libraries"

    url = f"https://{_cname}"
    #url = f"https://raw.githubusercontent.com/{user}/{repo}/main/README.md"

    generate_web = GenerateWeb(manifest.libs, url, user, library_dir, build_dir, os.path.abspath(template_dir), static_dir, verbose, compile_tailwind)
    generate_web.generate()
    print(f"Generated web to {build_dir} directory in {time() - start:.2f} seconds")


@click.command(help='Serve generated web with livereload / without livereload')
@click.option('--port', default=8000, help='Port to serve on (default is 8000)')
@click.option('--host', default='localhost', help='Host to serve on (default is localhost)')
@click.option('--build-dir', default='build', help='build directory (default is build)')
@click.option('--no-livereload', default=False, is_flag=True, help='Disable live reload and serve only once')
def serve(port: int, host: str, build_dir: str, no_livereload: bool):
    os.chdir(build_dir)
    if no_livereload:
        import http.server
        import socketserver
        Handler = http.server.SimpleHTTPRequestHandler
        with socketserver.TCPServer((host, port), Handler) as httpd:
            httpd.allow_reuse_address = True
            print(f"Serving at http://{host}:{port}")
            httpd.serve_forever()
    else:
        import livereload
        server = livereload.Server()
        # watch everything in the build directory
        server.watch(".")
        print(f"Serving at http://{host}:{port}")
        server.serve(port=port, host=host)


cli.add_command(generate)
cli.add_command(serve)

if __name__ == '__main__':
    cli()