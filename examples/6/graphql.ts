import { request, rawRequest } from "graphql-request";

async function main() {
    const query = `{
        human(id: "1000") {
          name
          height(unit: FOOT)
        }
    }`;

    // const data = await request("http://localhost:8080/graphql", query);
    // console.log(data);

    // const raw = await rawRequest("http://localhost:8080/graphql", query);
    // console.log(JSON.stringify(raw));

    const mutationQuery = `mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
        createReview(episode: $ep, review: $review) {
          stars
          commentary
        }
      }
`;
    // notice! This is object, not a string!
    const mutationVars = {
        ep: "JEDI",
        review: {
            stars: 1,
            commentary: "This is a shitty movie!"
        }
    };

    const mutationResp = await request("http://localhost:8080/graphql", query, mutationVars);
    console.log(mutationResp);
}

main().catch(err => console.log(err.message));
