import os
import logging
import json
import subprocess

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GenerateManifest:
    def __init__(self, library_dir: str = "libraries", verbose: bool = False):
        self.verbose = verbose

        self.libs = []
        libs = os.listdir(library_dir)
        for lib in libs:
            folder_content: list[str] = os.listdir(os.path.join(library_dir, lib))

            if "manifest.json" not in folder_content:
                logger.warning(f"No manifest.json in {lib}")
                continue

            with open(os.path.join(library_dir, lib, "manifest.json"), "r") as f:
                manifest: dict = json.load(f)

            self.libs.append(
                {
                    "folder": lib,
                    "name": manifest.get("name"),
                    "description": manifest.get("description"),
                    "files": manifest.get("files"),
                    "examples": manifest.get("examples"),
                }
            )


class GenerateJavascript:
    def __init__(
        self,
        libs_dir: str = "libraries",
        build_libs_dir: str = "build/data/libs",
    ):
        self.libs_dir = libs_dir
        self.build_libs_dir = build_libs_dir



    def generate(self):
        try:
            print(f"Compiling {self.libs_dir} to {self.build_libs_dir}")
            result = subprocess.run(
                [
                    "node",
                    "src/compileJs.js",
                    self.libs_dir,
                    self.build_libs_dir,
                ],
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            print("Compilation successful!")
        except Exception as e:
            print("Compilation errored!")
            print(e)
