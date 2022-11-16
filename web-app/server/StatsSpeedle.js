/**
 * StatsSpeedle is a module to load and save game stats for Speedle games.
 * @namespace StatsSpeedle
 * @author Lucas Newman
 * @version 2021/22
 */
const StatsSpeedle = Object.create(null);


const scores = [];

/**
 * Function to resiter and process scores
 * @memberof StatsSpeedle
 * @function
 * @param {number}
 * @returns {function StatsSpeedle.top_ten()}
 */
StatsSpeedle.register = function (score) {
    scores.push({"score": score});
    scores.sort((a, b) => b.score - a.score); //sorthing the scores

    return StatsSpeedle.top_ten();
};

/**
 * FUnction to take in registered scores and return total list of scores
 * @memberof StatsSpeedle
 * @function
 * @returns {}
 */
StatsSpeedle.top_ten = function () {
    scores.splice(10); //only allowing the top 10 scores
    console.log(scores);
    return scores;
};

export default Object.freeze(StatsSpeedle);
