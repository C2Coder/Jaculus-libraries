import os
import logging
import yaml, json
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

            if "manifest.yaml" not in folder_content:
                logger.warning(f"No manifest.yaml in {lib}")
                continue

            manifest: dict = yaml.safe_load(
                open(os.path.join(library_dir, lib, "manifest.yaml"))
            )

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


class GenerateJsonManifests:
    def __init__(
        self,
        folders: list,
        main_manifest: str = "manifest.yaml",
        libs_dir: str = "libraries",
        build_dir: str = "build",
        build_libs_dir: str = "build/data/libs",
    ):
        self.folders = folders
        self.main_manifest = main_manifest
        self.libs_dir = libs_dir
        self.build_dir = build_dir
        self.build_libs_dir = build_libs_dir

    def yaml_to_json(self, yaml_file_path, json_file_path):
        # Read the YAML file
        with open(yaml_file_path, 'r') as yaml_file:
            yaml_content = yaml.safe_load(yaml_file)

        # Save the content as a JSON file
        with open(json_file_path, 'w') as json_file:
            json.dump(yaml_content, json_file, indent=4)

    def generate(self):
        print("Generating json versions of manifests")
        manifests = [
            (
                os.path.join(self.libs_dir, folder, "manifest.yaml"),
                os.path.join(self.build_libs_dir, folder, "manifest.json"),
            )
            for folder in self.folders
        ]
        manifests.append(
            (
                os.path.join(self.build_libs_dir, self.main_manifest),
                os.path.join(self.build_libs_dir, self.main_manifest.replace("yaml", "json")),
            )
        )

        for m in manifests:
            self.yaml_to_json(m[0], m[1])
