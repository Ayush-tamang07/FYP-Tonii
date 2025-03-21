const axios = require('axios');

const suggestion = async(req,res)=>{
  try {
    const { user_details, user_preferences } = req.body;
    if (!user_details || !user_preferences) {
      res.status(400).json({ error: "User details and preferences are required" });
      return;
    }
    const responseData= await axios.post('http://0.0.0.0:5000/suggestion', {
        user_details,
      user_preferences
    });
    console.log("suggestion",responseData.data.suggestions);
    return res.status(200).json(responseData.data);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
}

module.exports={
    suggestion
}
