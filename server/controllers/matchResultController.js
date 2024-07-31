import MatchResult from "../models/matchResultModel.js";

const getMatchResults = async (req, res) => {
  try {
    const matchResults = await MatchResult.find()
      .populate({
        path: "supervisor",
        select: "name faculty researchArea",
        populate: [
          {
            path: "faculty",
            model: "Faculty",
            select: "name",
          },
        ],
      })
      .populate({
        path: "student",
        select: "name course faculty job company",
        populate: [
          {
            path: "faculty",
            model: "Faculty",
            select: "name",
          },
          {
            path: "company",
            model: "Company",
            select: "name",
          },
          {
            path: "job",
            model: "Job",
            select: "title tokens" ,
          },
        ],
      });

    res.status(200).json(matchResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export { getMatchResults };
