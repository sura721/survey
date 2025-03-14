import '../styles/surveys.css'
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

const Surveys = () => {
    const [userData, setUserData] = useState({
        questionOne: [],
        usersJob: '',
        jobType: '',
        levelOfEducation: '',
        wayOfGettingInfo: '',
        fullname: '',
        phone: '',
        address: '',
        gender: ''
    });
    const history = useNavigate();

    function startSurvey() {
        // Create a loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading';

        // Create a spinner
        const spinner = document.createElement('div');
        spinner.className = 'spinner';

        loadingOverlay.appendChild(spinner);
        loadingOverlay.innerHTML += ' processing...'; // "Please wait..."
        document.body.appendChild(loadingOverlay);

        // Simulate a loading process
        setTimeout(() => {
            document.getElementById('welcomePage').classList.add('hidden'); // Hide welcome page
            document.getElementById('surveyContainer').classList.remove('hidden'); // Show survey
            document.body.removeChild(loadingOverlay); // Remove loading overlay
        }, 2000); // Adjust time as needed (2000ms = 2 seconds)
    }

    const handleUsersJobChange = (event) => {
        setUserData((prevState) => ({
            ...prevState,
            usersJob: event.target.value
        }));
    };

    const handleUsersJobType = (event) => {
        setUserData((prevState) => ({
            ...prevState,
            jobType: event.target.value
        }));
    };

    const submitSurvey = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://survey-kd6u.onrender.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit data");
            }

            const result = await response.json();
            console.log("Success:", result);

            // Hide survey form and show thank you message
            document.getElementById("surveyContainer").classList.add("hidden");
            document.getElementById("thankYouMessage").classList.remove("hidden");

            history("/thanks");

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to submit survey. Please try again.");
        }
    };

    const handleQuestionOne = (e) => {
        const { value, checked } = e.target;

        setUserData(prevState => {
            const updatedQuestionOne = checked
                ? [...prevState.questionOne, value]  // Add value if checked
                : prevState.questionOne.filter(item => item !== value);  // Remove value if unchecked

            return {
                ...prevState,
                questionOne: updatedQuestionOne
            };
        });
    };

    const handleLevelOfEducationChange = (event) => {
        setUserData((prevState) => ({
            ...prevState,
            levelOfEducation: event.target.value
        }));
    };

    const handleWayOfGettingInfoChange = (event) => {
        setUserData((prevState) => ({
            ...prevState,
            wayOfGettingInfo: event.target.value
        }));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            <div className="container" id="welcomePage">
                <h1>እንኳን ደህና መጡ!</h1>
                <p>
                    ይህ መጠይቅ የተዘጋጀው ህይወታቸው ላይ ትላልቅ አውንታዊ ለውጥን በሁሉም በህይወት ዘርፋቸው ላይ ለማምጣት ዝግጁ የሆኑ ቀና አስተሳሰብ ያላቸው ነቃ በለው
                </p>
                <button onClick={() => startSurvey()}>Start Survey</button>
            </div>

            <div className="container hidden" id="surveyContainer">
                <h1>የቢዝነስ እድል</h1>
                <p>
                    እንኳን ደህና መጡ። ይህ መጠይቅ የተዘጋጀው ህይወታቸው ላይ ትላልቅ አውንታዊ ለውጥን በሁሉም በህይወት ዘርፋቸው ላይ ለማምጣት ዝግጁ የሆኑ ቀና አስተሳሰብ ያላቸው ነቃ በለው
                </p>

                <form onSubmit={submitSurvey} >
                    <div className="question">
                        <label>1. ይህ ቢዝነስ የቢዝነስ ዕድል ለሁሉም ቢደረስም ለሁሉም ግን አይሆንም! እርሷም ከዚህ በታች ካሉት ውስጥ ለምን ለእርሶ አንደሚሆን ይምረጡ:</label>
                        <label><input required type="checkbox" name="question1" value="ተጨማሪ ገቢ ስለምፈልግ" onClick={handleQuestionOne} /> ተጨማሪ ገቢ ስለምፈልግ</label>
                        <label><input type="checkbox" name="question1" value="አሁን ካለሁበት የተሻለ ቦታ መሆን ስለምፈልግ" onClick={handleQuestionOne} /> አሁን ካለሁበት የተሻለ ቦታ መሆን ስለምፈልግ</label>
                        <label><input type="checkbox" name="question1" value="ለወቅቱ የሚመጥን የገቢ አማረጭ ስለምፈልግ" onClick={handleQuestionOne} /> ለወቅቱ የሚመጥን የገቢ አማረጭ ስለምፈልግ</label>
                        <label><input type="checkbox" name="question1" value="በወጣትነቴ ሀብታም መሆን እና ጡረታ መውጣት ስለምፈልግ" onClick={handleQuestionOne} /> በወጣትነቴ ሀብታም መሆን እና ጡረታ መውጣት ስለምፈልግ</label>
                        <label><input type="checkbox" name="question1" value="ገንዘብ ለማግኘት ሁሌም እኔን የማይፈልግ ሲስተም መገንባት ስለምፈልግ" onClick={handleQuestionOne} /> ገንዘብ ለማግኘት ሁሌም እኔን የማይፈልግ ሲስተም መገንባት ስለምፈልግ</label>
                        <label><input type="checkbox" name="question1" value="ከራሴ አልፌ ለብዙ ሰዎች መተረፍ ስለምፈልግ" onClick={handleQuestionOne} /> ከራሴ አልፌ ለብዙ ሰዎች መተረፍ ስለምፈልግ</label>
                        <label><input type="checkbox" name="question1" value="አሁን ካለኝ የቢዝነስ አስተሳሰብ የተሻለ የቢዝነስ አስተሳሰብ እንዲኖረኝ ስለምፈልግ" onClick={handleQuestionOne} /> አሁን ካለኝ የቢዝነስ አስተሳሰብ የተሻለ የቢዝነስ አስተሳሰብ እንዲኖረኝ ስለምፈልግ</label>
                        <label><input type="checkbox" name="question1" value="በቡድን መስራት ማድገን ስለምመረጥ" onClick={handleQuestionOne} /> በቡድን መስራት ማድገን ስለምመረጥ</label>
                        <label><input type="checkbox" name="question1" value="አሁን ባለኝ እውቀት ፣ ችሎታ ፣ ገንዘብ እና ሙያ ብቻ የምሰራው ቢዝነስ ስለምፈልግ" onClick={handleQuestionOne} /> አሁን ባለኝ እውቀት ፣ ችሎታ ፣ ገንዘብ እና ሙያ ብቻ የምሰራው ቢዝነስ ስለምፈልግ</label>
                        <label><input type="checkbox" name="question1" value="የትም መቼም ልሰራው የምችለው ቢዝነስ ስለምፈልግ" onClick={handleQuestionOne} /> የትም መቼም ልሰራው የምችለው ቢዝነስ ስለምፈልግ</label>
                    </div>

                    <div className="question">
                        <label>2. በምን ስራ ላይ ተሰማረተዎል?</label>
                        <div>
                        <label><input type="radio" name="usersJob" value="ትምህርት" required onChange={handleUsersJobChange} /> ትምህርት</label>
                        <label><input type="radio" name="usersJob" value="ስራ" required onChange={handleUsersJobChange} /> ስራ</label>
                        <label><input type="radio" name="usersJob" value="ምንም" required onChange={handleUsersJobChange} /> ምንም</label>
                        <label><input type="radio" name="usersJob" value="ተማሪም ሰራተኛም" required onChange={handleUsersJobChange} /> ተማሪም ሰራተኛም</label>
                        <input type="text" name="other5" placeholder="other" style={{ width: "100%" }} onChange={handleUsersJobChange} />
                        </div>
                    </div>

                    <div className="question">
                        <label>3. ስራ ላይ ከሆኑ?</label>
                        <div>
                        <label><input type="radio" name="jobType" value="የግል" onChange={handleUsersJobType} required/> የግል</label>
                        <label><input type="radio" name="jobType" value="በቅጥር" onChange={handleUsersJobType} required/> በቅጥር</label>
                        <label><input type="radio" name="jobType" value="ሁለቱም" onChange={handleUsersJobType} required/> Both</label>
                        <input type="text" name="other5" placeholder="other" style={{ width: "100%" }} onChange={handleUsersJobType} />
                        </div>
                    </div>

                    <div className="question">
                        <label>4. ትምህርት ላይ ከሆኑ በየትኛው ደረጃ?</label>
                       <div>
                       <label><input type="radio" name="levelOfEducation" value="ፕሪፓራቶሪ" required onChange={handleLevelOfEducationChange} /> ፕሪፓራቶሪ</label>
                        <label><input type="radio" name="levelOfEducation" value="ኮሌጅ / ዩንቨርስቲ" required onChange={handleLevelOfEducationChange} /> ኮሌጅ / ዩንቨርስቲ</label>
                        <input type="text" name="other5" placeholder="other" style={{ width: "100%" }} onChange={handleLevelOfEducationChange} />
                       </div>
                    </div>

                    <div className="question">
                        <label>5. ከላይ የተጠቀሰው አይነት ቢዝነስ ለእርሷ ልንሰጦጥት ዝግጁ ነን። እርሶም ዝግጁ ከሆኑ መረጃ ሊያገኙበት የሚፈልጉበትን መንገድ ይምረጡ:</label>
                        <div>
                        <label><input type="radio" name="wayOfGettingInfo" value="በአካል" required onChange={handleWayOfGettingInfoChange} /> በአካል</label>
                        <label><input type="radio" name="wayOfGettingInfo" value="በስልክ" required onChange={handleWayOfGettingInfoChange} /> በስልክ</label>
                        <label><input type="radio" name="wayOfGettingInfo" value="በቴሌግራም" required onChange={handleWayOfGettingInfoChange} /> በቴሌግራም</label>
                        <input type="text" name="other5" placeholder="other" style={{ width: "100%" }} onChange={handleWayOfGettingInfoChange} />
                        </div>
                    </div>

                    <div className="question">
                        <label>6. ሙሉ ስም*</label>
                        <input type="text" name="fullname" placeholder="የእርሷ ሙሉ ስም ይጻፉ" required onChange={handleInputChange} />
                    </div>

                    <div className="question">
                        <label>7. ስልክ ቁጥር*</label>
                        <input type="tel" name="phone" placeholder="የእርሷ ስልክ ቁጥር ይጻፉ" required onChange={handleInputChange} />
                    </div>

                    <div className="question">
                        <label>8. አድራሻ (ከተማ)*</label>
                        <input type="text" name="address" placeholder="የእርሷ ከተማ ይጻፉ" required onChange={handleInputChange} />
                    </div>

                    <div className="question">
                        <label>9. ፆታ*</label>
                        <div>
                        <label><input type="radio" name="gender" value="ወንድ" required onChange={handleInputChange} /> ወንድ</label>
                        <label><input type="radio" name="gender" value="ሴት" required onChange={handleInputChange} /> ሴት</label>
                        </div>
                    </div>

                    <div className="container hidden" id="thankYouMessage">
                        <h1>እናመሰግናለን!</h1>
                        <p>We greatly appreciate you taking the time to complete the survey.</p>
                    </div>

                    <button type="submit" >አስተያየት ይላኩ</button>
                </form>
            </div>
        </>
    );
};

export default Surveys;


// eyoabssurveys