import os
import shutil
import json
import time


def update_lib(lib_name:str, lib_folder:str, libs:list, libs_dir:str):
    index = libs.index([lib for lib in libs if lib_name in lib.get("folder")][0])
    files = os.listdir("tmp/"+lib_folder)

    if lib_name in ["@types"]:
        shutil.rmtree(os.path.join(libs_dir, libs[index].get("folder")))
        os.mkdir(os.path.join(libs_dir, libs[index].get("folder")))
        libs[index].update({"files": files})

        with open(os.path.join(libs_dir, libs[index].get("folder"), "manifest.json"), "w") as f:
            json.dump(libs[index], f, indent=4)
    
        for file in files:
            shutil.copy(os.path.join("tmp/"+ lib_folder, file), os.path.join(libs_dir, libs[index].get("folder")))
    else:
        for file in libs[index]["files"]:
            shutil.copy(os.path.join("tmp/"+ lib_folder, file), os.path.join(libs_dir, libs[index].get("folder")))
    

def update_libs(libs:list, libs_dir:str):
    
    if os.path.exists("tmp"):
        shutil.rmtree("tmp")
    os.mkdir("tmp")
    os.system("cd tmp && git clone --depth=1 https://github.com/cubicap/Jaculus-esp32.git")
    os.system("cd tmp && git clone --depth=1 https://github.com/RoboticsBrno/Robutek.git")
    time.sleep(2)
    lib_folders = {
        "@types":"Jaculus-esp32/ts-examples/@types",
        "servo":"Robutek/robutekLibrary/src/libs",
        "readline" : "Robutek/robutekLibrary/src/libs",
        "colors" : "Robutek/robutekLibrary/src/libs",
        "VL53L0X" : "Robutek/robutekLibrary/src/libs",
        "robutek" : "Robutek/robutekLibrary/src/libs",
    }

    for lib in libs:
        if lib["folder"] in lib_folders.keys():
            update_lib(lib["folder"], lib_folders[lib["folder"]], libs, libs_dir)
    
    #shutil.rmtree("tmp")




