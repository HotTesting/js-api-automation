import { expect } from "chai";
import { Friends } from "../../framework4/service/friends";
import { Reviews } from "../../framework4/service/reviews";

describe("Hero", function() {
    it("friends of hero by name should be correct", async function() {
        let res = await new Friends().friendsByName("Luke Skywalker");

        expect(res.length).to.equal(1);

        const result = res[0];
        expect(result.name).to.equal("Luke Skywalker");
        expect(result.id).to.equal("1000");

        const friendsNames = result.friends.map(friend => friend.name);

        expect(friendsNames).to.include("Han Solo");
        expect(friendsNames).to.include("Leia Organa");
        expect(friendsNames).to.include("R2-D2");
        expect(friendsNames).to.include("C-3PO");
    });

    it("friends of hero by id should be correct", async function() {
        let result = await new Friends().friendsById(1000);

        expect(result.name).to.equal("Luke Skywalker");
        expect(result.id).to.equal("1000");

        const friendsNames = result.friends.map(friend => friend.name);

        expect(friendsNames).to.include("Han Solo");
        expect(friendsNames).to.include("Leia Organa");
        expect(friendsNames).to.include("R2-D2");
        expect(friendsNames).to.include("C-3PO");
    });
});

describe("Review", function() {
    it("can add review", async function() {
        const createdReview = await new Reviews().createReview({
            ep: "JEDI",
            review: {
                stars: 2,
                commentary: "Horrible movie!"
            }
        });

        expect(createdReview.commentary).to.equal("Horrible movie!");
        expect(createdReview.stars).to.equal(2);

        const jediReviews = await new Reviews().getReviewsByEpisode("JEDI");
        expect(jediReviews.length).to.equal(1)

        expect(jediReviews[0].commentary).to.equal("Horrible movie!");
        expect(jediReviews[0].stars).to.equal(2);
    });
});
