const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports.main_get = (req, res) =>{
    res.render("index")
};

module.exports.correct_post = async(req , res)=>{
    const { text } = req.body;

    console.log('Attempting to use API Key:', process.env.GEMINI_API_KEY ? 'Key Found' : 'Key NOT FOUND');


    if(!text){
        return res.status(400).json({error:'Text to correct cannot be empty.'});
    }

    try{

        // initialize the genAi model
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model :"gemini-2.0-flash" });

        // construct the prompt 
        const prompt = `
             You are an expert editor. Please correct the following text for any grammar mistakes, spelling errors, and awkward phrasing.
             Rewrite the paragraph to be clear, concise, and grammatically perfect.
             Do not add any commentary, preamble, or explanation. Only return the corrected text.

             Original text: "${text}"

            Corrected text:
            `;

    // call the gemini api
    const result = await model.generateContent(prompt);
    const response = await result.response ;
    const correctedText = response.text();
    
    res.status(200).json({ correctedText });

    }
    catch(error){
          console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: 'Failed to correct text. Please try again.' });
    }
};