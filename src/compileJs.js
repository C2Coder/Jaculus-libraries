
import ts from "typescript";

const [inDir, outDir] = process.argv.slice(2);


if (!inDir || !outDir) {
    console.error("Usage: node compile_ts.js <in folder> <out folder>");
    process.exit(1);
}

console.log(`Compiling ${inDir} to ${outDir}`);

compile(inDir, outDir);


function compile(inDir, outDir) {
    const tsconfig = ts.findConfigFile("./", ts.sys.fileExists, "tsconfig-base.json");
    if (!tsconfig) {
        throw new Error("Could not find tsconfig-base.json");
    }
    const config = ts.readConfigFile(tsconfig, ts.sys.readFile);
    if (config.error) {
        throw new Error("Error reading tsconfig-base.json");
    }

    const forcedOptions = {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.ES2020,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        resolveJsonModule: false,
        esModuleInterop: true,
        outDir: outDir,
        rootDir: "",
    };

    config.config.compilerOptions = config.config.compilerOptions || forcedOptions;

    const { options, fileNames, errors } = ts.parseJsonConfigFileContent(config.config, ts.sys, inDir);
    if (errors.length > 0) {
        errors.forEach(error => console.log(error.messageText));
        throw new Error("Error parsing tsconfig-base.json");
    }

    for (const [ key, value ] of Object.entries(forcedOptions)) {
        if (options[key] && options[key] !== value) {
            throw new Error(`tsconfig-base.json must have ${key} set to ${value}`);
        }
        else {
            options[key] = value;
        }
    }

    const program = ts.createProgram(fileNames, options);
    const emitResult = program.emit();

    const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    const error = diagnostics.some(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error);

    if (emitResult.emitSkipped) {
        throw new Error("Compilation failed");
    }

    return !emitResult.emitSkipped && !error;
}


