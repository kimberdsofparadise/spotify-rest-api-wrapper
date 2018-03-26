const { makeExecutableSchema } = require("graphql-tools");

const fetch = require("node-fetch");

const gql = String.raw;

// Construct a schema, using GraphQL schema language. See: http://graphql.org/learn/schema/
const typeDefs = gql`
  type Query {
    myFavoriteArtists: [Artist]
  }
  type Artist @cacheControl(maxAge: 60) {
    id: String
    name: String
    relatedArtists: [RelatedArtist]
	
  }
  type RelatedArtist @cacheControl(maxAge: 60) {
    name: String
    id: String
	href: String
  }
`;
