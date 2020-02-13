<p align="center">
  <img src="https://user-images.githubusercontent.com/35740512/71934637-c8b22a00-319c-11ea-8b73-a48e7851b7d2.png" alt="ESLint Config Kit" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@eslint-kit/cli">
    <img src="https://img.shields.io/npm/v/@eslint-kit/cli">
  </a>
  <a href="https://github.com/eslint-kit/cli/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/eslint-kit/cli">
  </a>
</p>

---

The ESLint Kit CLI is a command-line interface tool that helps you to setup ESLint for your project.

It can:

- Setup configs from [eslint-config-kit](https://github.com/eslint-kit/eslint-config-kit) automatically.  
  **(JSON / YAML eslint config files are supported)**

- Install required dependencies.  
  **(NPM / Yarn)**

- Add aliases support for `eslint-plugin-import`.  
  **(both JS and TS parsers are supported)**

- Create recommended `.prettierrc` for `kit/prettier` config.

## Installation

```
$ npm i -g @eslint-kit/cli
```

## Usage

- [Manage configs](#manage-configs)
- [Setup aliases](#setup-aliases)

### Manage configs

```
$ eslint-kit
```

or

```
$ eslint-kit config
```

### Setup aliases

```
$ eslint-kit alias
```

Learn more about `eslint-kit` [here](https://github.com/eslint-kit/eslint-config-kit).