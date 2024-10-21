import React, { useState, useEffect } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import axios from "axios";

const Main = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [displayedAnswer, setDisplayedAnswer] = useState(""); // For the typing effect
  const [recentQuestion, setRecentQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (answer) {
      typeAnswer(answer); // Start typing effect when answer is available
    }
  }, [answer]);

  // Typing effect function
  const typeAnswer = (text) => {
    let index = 0;
    setDisplayedAnswer(""); // Clear the displayed answer

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedAnswer((prev) => prev + text[index]); // Add next character
        index++;
      } else {
        clearInterval(typingInterval); // Clear interval when done
      }
    }, 50); // Delay between each character (adjust to control typing speed)
  };

  async function generateAnswer() {
    setLoading(true); // Set loading to true when generating answer
    setAnswer(""); // Clear the previous answer
    setDisplayedAnswer(""); // Clear the displayed answer for the typing effect

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB6p4NX1dsNmjPPnLF0LCAiW0eabsmzT7s",
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      let generatedAnswer = response.data.candidates[0].content.parts[0].text;

      // Format answer to bold text between ** and line breaks between *
      let responseArray = generatedAnswer.split("**");
      let formattedAnswer = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i % 2 === 1) {
          formattedAnswer += "<b>" + responseArray[i] + "</b>";
        } else {
          formattedAnswer += responseArray[i];
        }
      }
      formattedAnswer = formattedAnswer.split("*").join("<br>");

      setAnswer(formattedAnswer); // Set the formatted answer
      setRecentQuestion(question);
      setQuestion(""); // Reset the input field
    } catch (error) {
      setAnswer("Error generating answer");
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false after the response is processed
    }
  }

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
      </div>

      <div className="main-container">
        {!answer && !loading ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Dev.</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                <p>Improve the readability of the following code </p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentQuestion}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: displayedAnswer }}></p> // Display with typing effect
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here"
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img onClick={generateAnswer} src={assets.send_icon} alt="" />
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its response. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
