import SupervisorInterest from "../models/supervisorInterestModel.js";

const getSupervisorInterests = async (req, res) => {
  const supervisorId = req.params.supervisorId;
  try {
    const interests = await SupervisorInterest.find({
      supervisor: supervisorId,
    });
    res.json(interests);
  } catch (error) {
    console.error("Error fetching supervisor interests:", error);
    res.status(500).json({ error: "Failed to fetch supervisor interests" });
  }
};

const createOrUpdateSupervisorInterest = async (req, res) => {
  console.log("Received data:", req.body); // Log the incoming request body
  try {
    const interests = req.body; // Expecting an array of interests

    for (const interest of interests) {
      const {
        supervisor,
        company,
        jobTitle,
        interest: interestValue,
        reason,
      } = interest;

      if (!supervisor || !company || !jobTitle) {
        return res
          .status(400)
          .json({ error: "Supervisor, company, and job scope are required." });
      }

      let supervisorInterest = await SupervisorInterest.findOne({
        supervisor,
        company,
        jobTitle,
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
          jobTitle,
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

export { createOrUpdateSupervisorInterest, getSupervisorInterests };
