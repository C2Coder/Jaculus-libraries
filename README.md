# Jaculus-libraries
Jaculus repository for all libraries

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
