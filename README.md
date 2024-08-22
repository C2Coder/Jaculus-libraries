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
├── manifest.yaml
├── colors/
│   ├── colors.ts
│   ├── manifest.yaml
│   └── examples/
│       └── basic-usage.ts
└── ...
```

All filenames are in the manifest.yaml file <br>
Every .ts and .yaml files are compiled to .js/.json files
