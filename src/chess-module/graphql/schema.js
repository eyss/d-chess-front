import gql from 'graphql-tag'

export const gameSchema = gql`
  scalar Date

  type Game {
    id: ID!

    players: [Agent!]!
    createdAt: Date!

    winner: Agent

    state: String!
    moves: [String!]!
  }

  extend type Me {
    games: [Game!]!
  }

  extend type Query {
    game(gameId: ID!): Game!
  }

  extend type Mutation {
    makeMove(gameId: ID!, from: String!, to: String!): String!
  }

`;