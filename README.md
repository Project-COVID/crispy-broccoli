# the-kindness-project-webapp

- [the-kindness-project-webapp](#the-kindness-project-webapp)
  - [Configuration](#configuration)
  - [Development](#development)
    - [Dependencies](#dependencies)
    - [Releasing](#releasing)
  - [Changelog](#changelog)

![COVID](https://media.giphy.com/media/XgXj1tk82ho7ZNPb48/giphy.gif)

## Configuration

You must provide the following runtime environment variables. You can add them to a `.env` in the project root.

| Variable           | Description                                  |
| ------------------ | -------------------------------------------- |
| `NODE_ENV`         | One of `development`, `production`           |
| `PORT`             | The port binding for the server              |
| `SENDGRID_API_KEY` | SendGrid API Key                             |
| `MONGODB_URI`      | The connection string for the Mongo instance |


## Development

See targets in `Makefile`.

### Dependencies

The following tools need to be installed on your machine and available in your `PATH`:

- `node` (v10.16.3)
- `yarn`
- `docker`
- `heroku`
- `make`

### Releasing

To create and push a release:

```sh
make release tag={tag}
```

This will:

1) Build a fresh image
2) Ask you to log in with Heroku
3) Create and push the new tag
4) Tag and push the image to the heroku registry
5) Deploy the application

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

