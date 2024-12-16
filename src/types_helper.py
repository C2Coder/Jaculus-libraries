import os
import shutil
import json

def update_types(libs:list, libs_dir:str):
    
    print("here!!!")
    index = libs.index([lib for lib in libs if "@types" in lib.get("folder")][0])
    
    shutil.rmtree(os.path.join(libs_dir, libs[index].get("folder")))
    os.mkdir(os.path.join(libs_dir, libs[index].get("folder")))
    
    if os.path.exists("tmp"):
        shutil.rmtree("tmp")
    os.mkdir("tmp")
    os.system("cd tmp && git clone https://github.com/cubicap/Jaculus-esp32.git")
    
    files = os.listdir("tmp/Jaculus-esp32/ts-examples/@types")
    
    libs[index].update({"files": files})
    
    with open(os.path.join(libs_dir, libs[index].get("folder"), "manifest.json"), "w") as f:
        json.dump(libs[index], f, indent=4)
    
    for file in files:
        shutil.copy(os.path.join("tmp/Jaculus-esp32/ts-examples/@types", file), os.path.join(libs_dir, libs[index].get("folder")))
    
    
    shutil.rmtree("tmp")




