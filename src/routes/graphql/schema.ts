import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLOutputType,
  type GraphQLFieldConfigMap,
} from "graphql";
import {
  getAllStrains,
  getFieldTypes,
  type FieldType,
} from "../../services/strain.service";

function mapFieldTypeToGraphQL(type: FieldType): GraphQLOutputType {
  switch (type) {
    case "string":
      return GraphQLString;
    case "number":
      return GraphQLFloat;
    case "boolean":
      return GraphQLBoolean;
    case "string[]":
      return new GraphQLList(GraphQLString);
    case "number[]":
      return new GraphQLList(GraphQLFloat);
    case "boolean[]":
      return new GraphQLList(GraphQLBoolean);
    default: {
      // Fallback to string to keep schema valid even if we see an unknown shape
      return GraphQLString;
    }
  }
}

export function createSchema(): GraphQLSchema {
  const fieldTypes = getFieldTypes();

  const fields: GraphQLFieldConfigMap<any, any> = {};

  for (const [key, type] of Object.entries(fieldTypes)) {
    fields[key] = {
      type: mapFieldTypeToGraphQL(type as FieldType),
    };
  }

  const StrainType = new GraphQLObjectType({
    name: "Strain",
    fields: () => fields,
  });

  const QueryType = new GraphQLObjectType({
    name: "Query",
    fields: {
      strains: {
        type: new GraphQLList(StrainType),
        resolve: () => getAllStrains(),
      },
    },
  });

  return new GraphQLSchema({
    query: QueryType,
  });
}
