import os
import logging
import yaml

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GenerateManifest:
    def __init__(self, library_dir: str = "libraries", verbose: bool = False):
        self.verbose = verbose

        self.libs = []
        libs = os.listdir(library_dir)
        for lib in libs:
            folder_content:list[str] = os.listdir(os.path.join(library_dir, lib))

            if "manifest.yaml" not in folder_content:
                logger.warning(f"No manifest.yaml in {lib}")
                continue
            
            manifest:dict = yaml.safe_load(open(os.path.join(library_dir, lib, "manifest.yaml")))
            
            self.libs.append({
                "folder": lib,
                "name": manifest.get("name"),
                "description": manifest.get("description"),
                "examples": manifest.get("examples"),
                "files": manifest.get("files")
            })

        print(self.libs)
                


                


