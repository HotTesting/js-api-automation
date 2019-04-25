import { GQLRequest } from "../graphQLrequest";

export class Friends {
    async friendsById(id: number) {
        const friendsByIdQuery = `query friendsByID($id: ID!) {
            character(id: $id) {
              name
              id
              friends {
                name
                id
                appearsIn
              }
            }
          }                    
        `;

        const res = await new GQLRequest()
            .query(friendsByIdQuery)
            .variables({ id })
            .send();

        return res.data["character"] as {
            name: string;
            id: string;
            friends: {
                name: string;
                id: string;
                appearsIn: string[];
            }[];
        };
    }

    async friendsByName(name: string) {
        const friendsOfQuery = `query friendsByName($searchString: String) {
            search(text: $searchString) {
              ... on Character {
                name
                id
                friends {
                  name
                  id
                  appearsIn
                }
              }
            }
          }
        `;

        const resp = await new GQLRequest()
            .query(friendsOfQuery)
            .variables({ searchString: name })
            .send();

        return resp.data["search"] as {
            name: string;
            id: string;
            friends: {
                name: string;
                id: string;
                appearsIn: string[];
            }[];
        }[];
    }
}
