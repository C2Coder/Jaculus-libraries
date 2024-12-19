# Jaculus-libraries
Jaculus repository for all libraries

## Links

[Jaculus homepage](https://jaculus.org/)

[Jaculus Library Manager](https://github.com/C2Coder/Jaculus-library-manager)

[JacLy (Blocky enviroment)](https://c2coder.github.io/JacLy/)

## Dev

### Install

```bash
make install
```

### Generate web

```bash
make generate
```

### Serve web

```bash
make serve
```

## File structure
```
data/
├── manifest.json
├── colors/
│   ├── colors.ts
│   ├── manifest.json
│   └── examples/
│       └── basic-usage.ts
└── ...
```

All filenames are in the manifest.json file <br>
Every .ts file is compiled to .js file
