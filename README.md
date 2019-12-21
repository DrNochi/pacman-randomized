#### Setup
```
$ npm install [-D]
```
`-D` for development

#### Buildling `dist/` files (production version)
```
$ npm run [build|watch]
```
`watch` for continous build

#### Starting local server
```
$ npm start
```

- `localhost:5000`: Main game (production version, bundeled & minified `.js`)
- `localhost:5000/debug`: Debug / development version of the game (automatic debug mode, raw `.js`)
- `localhost:5000/introspect`: Used to watch training
