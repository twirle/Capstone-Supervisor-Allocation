import SupervisorInterest from "../models/supervisorInterestModel.js";

export const createOrUpdateSupervisorInterest = async (req, res) => {
  console.log("Received data:", req.body); // Log the incoming request body
  try {
    const interests = req.body; // Expecting an array of interests

    for (const interest of interests) {
      const {
        supervisor,
        company,
        jobScope,
        interest: interestValue,
        reason,
      } = interest;

      if (!supervisor || !company || !jobScope) {
        return res
          .status(400)
          .json({ error: "Supervisor, company, and job scope are required." });
      }

      let supervisorInterest = await SupervisorInterest.findOne({
        supervisor,
        company,
        jobScope,
      });

      if (supervisorInterest) {
        // Update existing interest
        supervisorInterest.interest = interestValue;
        supervisorInterest.reason = reason;
      } else {
        // Create new interest
        supervisorInterest = new SupervisorInterest({
          supervisor,
          company,
          jobScope,
          interest: interestValue,
          reason,
        });
      }

      // Save the record
      await supervisorInterest.save();
    }

    res.status(200).json({ message: "Interests updated successfully" });
  } catch (error) {
    console.error("Error saving supervisor interests:", error);
    res.status(500).json({ error: "Failed to save supervisor interests" });
  }
};
