# crispy-broccoli

- [crispy-broccoli](#crispy-broccoli)
  - [Configuration](#configuration)
  - [Development](#development)
  - [Changelog](#changelog)

![COVID](https://media.giphy.com/media/XgXj1tk82ho7ZNPb48/giphy.gif)

## Configuration

You must provide the following runtime environment variables. You can add them to a `.env` in the project root.

| Variable   | Description                        |
| ---------- | ---------------------------------- |
| `NODE_ENV` | One of `development`, `production` |
| `PORT`     | The port binding for the server    |


## Development

See targets in `Makefile`.

## Changelog

You need to update the changelogs file before each release. In order to update
the changelogs file run the following:

```bash
make changelog
```

When you are ready to make a commitment and tag the next release, use this
target and pass in the next tag:

```bash
make changelog_release tag=v1.0.1
```
