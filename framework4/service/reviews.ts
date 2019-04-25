import { GQLRequest } from "../graphQLrequest";

export class Reviews {
    async createReview(review: {
        ep: string;
        review: { stars: number; commentary: string };
    }) {
        const createReviewQuery = `mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
          createdReview: createReview(episode: $ep, review: $review) {
            stars
            commentary
          }
        }
        `;

        const resp = await new GQLRequest()
            .query(createReviewQuery)
            .variables(review)
            .send();

        return resp.data["createdReview"] as {
            stars: number;
            commentary: string;
        };
    }

    async getReviewsByEpisode(episode: string) {
        const getEpisodesQuery = `query EpisodeReviews($episode: Episode!) {
          reviews(episode: $episode) {
            commentary
            stars
          }
        }
      `;

        const resp = await new GQLRequest()
            .query(getEpisodesQuery)
            .variables({ episode: episode })
            .send();

        return resp.data["reviews"] as {
            commentary: string;
            stars: number;
        }[];
    }
}
