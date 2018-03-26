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

const resolvers = {
  Query: {
    myFavoriteArtists: (root, args, context) => {
      return Promise.all(
        myFavoriteArtists.map(({ name, id }) => {
          return fetch(
            `https://api.spotify.com/v1/artists/{id}&apikey=${
              context.secrets.SPOTIFY_API_KEY
            }`
          )
            .then(res => res.json())
            .then(data => {
              return Object.assign({ name, id }, data);
            });
        })
      );
    }
  },
  Artist: {
    relatedArtists: (artist, args, context) => {
      return fetch(
        `https://api.spotify.com/v1/artists/{id}/related-artists?size=10&apikey=${
          context.secrets.SPOTIFY_API_KEY
        }&attractionId=${artist.id}`
      )
        .then(res => res.json())
        .then(data => {
          // Just in case there are no related artists
          return (data && data._embedded && data._embedded.relatedArtists) || [];
        });
    }
  },
};

// Required: Export the GraphQL.js schema object as "schema"
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
// A list of artists for whom I want to learn about related artists
const myFavoriteArtists = [
  {
    name: "Rainbow Kitten Surprise",
    id: "4hz8tIajF2INpgM0qzPJz2"
  },
  {
    name: "Jasmine Thompson",
    id: "2TL8gYTNgD6nXkyuUdDrMg"
  },
  {
    name: "The Lumineers",
    id: "16oZKvXb6WkQlVAjwo2Wbg"
  }
];

module.exports = { schema };
