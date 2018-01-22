module.exports = expressGithubGraphqlStitch

const {
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  mergeSchemas
} = require('graphql-tools')
const fetch = require('node-fetch')
const { graphqlExpress } = require('apollo-server-express')
const jsonBodyParser = require('body-parser').json()

function expressGithubGraphqlStitch (options) {
  return (request, response, next) => {
    jsonBodyParser(request, response, (error) => {
      if (error) return next(error)

      graphqlExpress(request => ({
        schema: mergeSchemas({
          schemas: [githubSchema, options.schema],
          resolvers: options.resolvers
        }),
        context: {
          token: (request.headers.authorization || '').replace(/^(bearer|token)\s*/, '')
        }
      }))(request, response, next)
    })
  }
}

const fetcher = async ({ query, variables, operationName, context }) => {
  const fetchResult = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      authorization: `bearer ${context.graphqlContext.token}`
    },
    body: JSON.stringify({ query, variables, operationName })
  })

  const result = await fetchResult.json()
  return result
}
const githubSchema = makeRemoteExecutableSchema({
  schema: makeExecutableSchema({
    typeDefs: require('@gr2m/github-graphql-schema').schema.idl
  }),
  fetcher
})
