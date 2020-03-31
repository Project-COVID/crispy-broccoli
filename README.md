# Hi, we're The Kindness Project ❤️

[The Kindness Project](https://kindnessproject.xyz/) is on a mission to help the vulnerable amongst us get support during the current pandemic.

![COVID](https://kindnessproject.xyz/assets/img/share-card.png)

Put simply, we connect those in your area who can help with those who need it.

## Contents

- [Hi, we're The Kindness Project ❤️](#hi-were-the-kindness-project-%e2%9d%a4%ef%b8%8f)
  - [Contents](#contents)
  - [Why does the world need The Kindness Project?](#why-does-the-world-need-the-kindness-project)
  - [How it works](#how-it-works)
  - [For Developers](#for-developers)
    - [Configuration](#configuration)
    - [Development](#development)
      - [Dependencies](#dependencies)
      - [Releasing](#releasing)
    - [Changelog](#changelog)

## Why does the world need The Kindness Project?

The Kindness Project was inspired by the heartwarming community responses to the COVID-19 pandemic we've seen across the globe. In particular, thousands of [mutual aid](https://www.theguardian.com/world/2020/mar/16/covid-19-mutual-aid-how-to-help-the-vulnerable-near-you) Facebook groups have popped up, filled with posts from those offering and requesting help from their local community.

However, these groups have a big problem. If I wish to offer help, it's unlikely that the person who needs it most will find my post. Similarly, if I require help, it's difficult for me to find the post most relevant to me.

The Kindness Project aims to remove the friction in connecting those who are willing to help with those who need it.

## How it works

1) Select whether you **need help** or are willing to **offer it**
2) Search for your **location**
3) Browse the results for posts from nearby neighbours who can help you or who require your help. The **tags** on a post can help you identify which are relevant to you.
4) If you find a suitable result, simply **reply** to the post to get in touch with the author via email
5) If there are no suitable results, you can **create** a post to request or offer help for your community to see

## For Developers

### Configuration

You must provide the following runtime environment variables. You can add them to a `.env` in the project root.

| Variable           | Description                                  |
| ------------------ | -------------------------------------------- |
| `NODE_ENV`         | One of `development`, `production`           |
| `PORT`             | The port binding for the server              |
| `SENDGRID_API_KEY` | SendGrid API Key                             |
| `MONGODB_URI`      | The connection string for the Mongo instance |


### Development

See targets in `Makefile`.

#### Dependencies

The following tools need to be installed on your machine and available in your `PATH`:

- `node` (v10.16.3)
- `yarn`
- [`concurrently`](https://www.npmjs.com/package/concurrently)
- `docker`
- `heroku`
- `make`

#### Releasing

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

### Changelog

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

