# express-github-stitch

[![Greenkeeper badge](https://badges.greenkeeper.io/gr2m/express-github-stitch.svg)](https://greenkeeper.io/)

> express plugin for stitching GitHub’s GraphQL API

## Install

```bash
npm install @gr2m/express-github-stitch
```

## Usage

```js
const express = require('express')
const app = express()
const stitchGithub = require('@gr2m/express-github-stitch')

const schema = `
  extend type User {
    foo: String
  }
`

const resolvers = mergeInfo => ({
  User: {
    foo: {
      // define requirements for resolver, in this case url + login
      fragment: `fragment UserFragment on User { websiteUrl, login }`,
      // resolve the `twitter` property
      async resolve (parent, args, context, info) {
        return 'bar'
      }
    }
  }
})

app.use(stitchGithub({schema, resolvers}))
app.listen(3000)
```

You can now send a query to localhost:3000

```bash
curl http://localhost:3000/ \
  -XPOST \
  -H"Authorization: bearer <your token here>" \
  -H"Content-Type: application/json" \
  -d '{"query":"{ viewer { foo } }"}'
```

Which returns something like this

```json
{"data":{"viewer":{"foo":"bar"}}}
```

You can use the [GraphiQL app](https://github.com/skevy/graphiql-app) to send
queries. Don’t forget to set the `Authorization` header to `bearer <your token here>`.

## How it works

`express-github-stitch` is based on [Apollo’s GraphQL Tools for Schema Stitching](https://www.apollographql.com/docs/graphql-tools/schema-stitching.html)

## License

[MIT](LICENSE.md)
