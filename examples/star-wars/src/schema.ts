import { makeSchema, nullabilityGuardPlugin } from 'nexus'
import * as path from 'path'
import * as allTypes from './graphql'

/** Finally, we construct our schema (whose starting query type is the query type we defined above) and export it. */
export const schema = makeSchema({
  types: allTypes,
  outputs: {
    schema: path.join(__dirname, '../star-wars-schema.graphql'),
    typegen: path.join(__dirname.replace(/\/dist$/, '/src'), './star-wars-typegen.ts'),
  },
  plugins: [
    nullabilityGuardPlugin({
      shouldGuard: true,
      fallbackValues: {
        String: () => '',
        ID: () => 'MISSING_ID',
        Boolean: () => true,
      },
    }),
  ],
  sourceTypes: {
    modules: [
      {
        module: path.join(__dirname, 'types', 'backingTypes.ts'),
        alias: 'swapi',
      },
    ],
  },
  contextType: {
    module: path.join(__dirname, 'types', 'context.ts'),
    export: 'ContextType',
  },
  prettierConfig: require.resolve('../../../.prettierrc'),
  features: {
    abstractTypeStrategies: {
      resolveType: true,
    },
  },
})
