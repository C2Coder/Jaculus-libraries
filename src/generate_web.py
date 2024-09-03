import os
import yaml
import shutil
import time
from datetime import datetime
import os
from typing import Union

from jinja2 import Environment, FileSystemLoader, select_autoescape, Template
import subprocess
import logging

from src.generators import GenerateJavascript, GenerateJsonManifests
from src.jinja_extensions.color_extension import ColorExtension

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

now = str(datetime.now().year)

class GenerateWeb:
    def __init__(
            self,
            libs: list,
            url: str,
            user: str,
            repo: str,
            manifest_name: str = "manifest",
            libs_dir: os.path = 'libraries',
            build_dir: str = 'build',
            build_libs_dir: str = 'build/data',
            template_dir: os.path = 'templates',
            static_dir: os.path = 'static',
            verbose: bool = False,
            compile_tailwind: bool = False,
    ):

        self.libs = libs
        self.url = url
        self.user = user
        self.repo = repo
        self.manifest_name = manifest_name
        self.libs_dir = libs_dir
        self.static_dir = static_dir
        self.template_dir = template_dir
        self.build_dir = build_dir
        self.build_libs_dir = build_libs_dir
        self.verbose = verbose
        self.compile_tailwind = compile_tailwind
        if not os.path.exists(self.build_dir):
            os.mkdir(self.build_dir)

        self.env = Environment(
            loader=FileSystemLoader(template_dir),
            autoescape=select_autoescape(['html', 'jinja2']),
            extensions=[ColorExtension]
        )

        self.paths = {
            "/": {"path": "index.html", "showHeader": False, "external": False},
            "Libs": {"path": "libs/index.html", "showHeader": True, "external": False},
            "Lib": {"path": "libs/{}/index.html", "showHeader": False, "external": False},
        }

        self.env.globals['paths'] = self.paths

    def generate(self):
        self.clean()

        self.copy_static_files()

        self.generate_lib_manifest()
        self.copy_libs()
        time.sleep(0.5) # Wait for the copy_libs to finish
        self.generate_javascript()
        self.generate_json_manifest()

        self.generate_index()
        self.generate_libs_list()
        self.generate_lib_detail()

        if self.compile_tailwind:
            self.compile_tailwind_css()

    def clean(self):
        if os.path.exists(self.build_dir):
            shutil.rmtree(self.build_dir)
        
        os.mkdir(self.build_dir)
        os.mkdir(self.build_libs_dir)

    def copy_static_files(self):
        #TODO: not working
        if self.verbose:
            logger.info(f"Copying static files from {self.static_dir} to {self.build_dir}")

        if not os.path.exists(self.static_dir):
            logger.warning(f"Static directory {self.static_dir} does not exist")
            return

        shutil.copytree(self.static_dir, self.build_dir, dirs_exist_ok=True)

    def compile_tailwind_css(self):
        if self.verbose:
            logger.info('Compiling tailwindcss')

        try:
            # Assuming that your Tailwind CSS file is `./src/tailwind.css`
            # and you want to output to `./build/tailwind.css`.
            command = "npx tailwindcss -i css/style.css -o build/style.css"
            process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE)
            process.wait()
            print("Command executed successfully. Exit code:", process.returncode)

        except subprocess.CalledProcessError as e:
            print("An error occurred while executing the command. Error: ", e)


    def generate_lib_manifest(self):
        with open(os.path.join(self.build_libs_dir, "manifest.yaml"), 'w') as f:
            yaml.dump(self.libs, f)

    def copy_libs(self):
        shutil.copytree(self.libs_dir, self.build_libs_dir, dirs_exist_ok=True)

    def generate_javascript(self):
        GenerateJavascript(self.libs_dir, self.build_libs_dir).generate()

    def generate_json_manifest(self):
        GenerateJsonManifests([lib.get("folder") for lib in self.libs], "manifest.yaml", self.libs_dir, self.build_dir, self.build_libs_dir).generate()

    def generate_index(self): #TODO same as generate_libs_list
        self.render_page('libs.html', self.paths.get("/").get("path"), libs=self.libs, num_of_libs=len(self.libs), now=now, user=self.user, repo=self.repo, url=self.url)

    def generate_libs_list(self):
        self.render_page('libs.html', self.paths.get("Libs").get("path"), libs=self.libs, num_of_libs=len(self.libs), now=now, user=self.user, repo=self.repo, url=self.url)

    def generate_lib_detail(self):
        for lib in self.libs:
            lib:dict
            for i, example in enumerate(lib.get("examples")):
                with open(os.path.join(self.libs_dir, lib.get("folder"), example.get("file")), "r") as f:
                    lib["examples"][i]["code"] = f.read()
            _str = ""

            for f in lib.get("files"):
                _str += f"curl -o src/libs/{f} {self.url}/data/{lib.get('folder')}/{f}\n"
            lib["install_bash"] = _str.strip()

            self.render_page('libDetail.html', self.paths.get("Lib").get("path").format(lib.get("folder")), lib=lib, now=now, user=self.user, repo=self.repo, url=self.url)

    def render_page(self, template_name: Union[str, "Template"], path_render: str, **kwargs):
        template = self.env.get_template(template_name)
        full_path = os.path.join(self.build_dir, path_render)
        if not os.path.exists(os.path.dirname(full_path)):
            os.mkdir(os.path.dirname(full_path))
        try:
            with open(full_path, 'w') as f:
                if self.verbose:
                    logger.info(f"Generating {full_path}")
                f.write(template.render(**kwargs))
        except Exception as e:
            logger.error(f"Error while generating {path_render}")
            logger.error(e)
            raise e