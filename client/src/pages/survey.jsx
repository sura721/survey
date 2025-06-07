import '../styles/surveys.css';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Surveys = () => {
    const [currentPage, setCurrentPage] = useState('welcome');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({
        questionOne: [],
        usersJob: '',
        usersJobOther: '',
        jobType: '',
        jobTypeOther: '',
        levelOfEducation: '',
        levelOfEducationOther: '',
        wayOfGettingInfo: '',
        wayOfGettingInfoOther: '',
        fullname: '',
        phone: '',
        address: '',
        gender: ''
    });
    const history = useNavigate();

    const startSurvey = () => {
        setIsLoading(true);
        setTimeout(() => {
            setCurrentPage('survey');
            setIsLoading(false);
        }, 500);
    };

     const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;

        setUserData(prevState => {
            if (name === 'questionOne') {
                const updatedQuestionOne = checked
                    ? [...prevState.questionOne, value]
                    : prevState.questionOne.filter(item => item !== value);
                return {
                    ...prevState,
                    questionOne: updatedQuestionOne
                };
            }

            if (name.endsWith('Other')) {
                const baseName = name.replace('Other', '');
                return {
                    ...prevState,
                    [name]: value,
                    [baseName]: value
                };
            }

            return {
                ...prevState,
                [name]: value,
                [`${name}Other`]: ''
            };
        });
    };


    const submitSurvey = async (e) => {
        e.preventDefault();

        if (userData.questionOne.length === 0) {
            alert("Please select at least one option for question 1.");
            const q1Group = document.getElementById('questionOneGroup');
            if (q1Group) {
                q1Group.classList.add('border-red-500');
                 q1Group.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        } else {
             const q1Group = document.getElementById('questionOneGroup');
             if (q1Group) {
                 q1Group.classList.remove('border-red-500');
            }
        }


        const dataToSubmit = { ...userData };

        const fieldsWithOther = ['usersJob', 'jobType', 'levelOfEducation', 'wayOfGettingInfo'];

        fieldsWithOther.forEach(fieldName => {
            const otherFieldName = `${fieldName}Other`;
            const selectedValue = dataToSubmit[fieldName];
            const otherValue = dataToSubmit[otherFieldName];

            const standardOptions = {
                usersJob: ['ትምህርት', 'ስራ', 'ምንም', 'ተማሪም ሰራተኛም'],
                jobType: ['የግል', 'በቅጥር', 'ሁለቱም'],
                levelOfEducation: ['ፕሪፓራቶሪ', 'ኮሌጅ / ዩንቨርስቲ'],
                wayOfGettingInfo: ['በአካል', 'በስልክ', 'በቴሌግራም']
            };


            if (standardOptions[fieldName].includes(selectedValue) || !otherValue) {
                 delete dataToSubmit[otherFieldName];
            } else if (otherValue) {
                 dataToSubmit[fieldName] = otherValue;
                 delete dataToSubmit[otherFieldName];
            }

        });


        setIsSubmitting(true);

        try {
            const response = await fetch("https://businesssurvey-gvrb.onrender.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Failed response:", response.status, errorBody);
                throw new Error(`Failed to submit data: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const result = await response.json();
            console.log("Success:", result);

            history("/thanks");

        } catch (error) {
            console.error("Error:", error);
            alert(`Failed to submit survey. Please try again. Details: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };


    const showJobTypeQuestion = userData.usersJob === 'ስራ' || userData.usersJob === 'ተማሪም ሰራተኛም';
    const showEducationLevelQuestion = userData.usersJob === 'ትምህርት' || userData.usersJob === 'ተማሪም ሰራተኛም';


    let currentDisplayQuestionNumber = 3;

    let jobTypeQuestionLabel = null;
    if (showJobTypeQuestion) {
        jobTypeQuestionLabel = `${currentDisplayQuestionNumber}. ስራ ላይ ከሆኑ?`;
        currentDisplayQuestionNumber++;
    }

    let educationLevelQuestionLabel = null;
     if (showEducationLevelQuestion) {
        educationLevelQuestionLabel = `${currentDisplayQuestionNumber}. ትምህርት ላይ ከሆኑ በየትኛው ደረጃ?`;
        currentDisplayQuestionNumber++;
    }

    const wayOfGettingInfoQuestionLabel = `${currentDisplayQuestionNumber}. ከላይ የተጠቀሰው አይነት ቢዝነስ ለእርስዎ ልንሰጦጥት ዝግጁ ነን። እርሶም ዝግጁ ከሆኑ መረጃ ሊያገኙበት የሚፈልጉበትን መንገድ ይምረጡ:`;
     currentDisplayQuestionNumber++;


    const fullnameQuestionLabel = `${currentDisplayQuestionNumber}. ሙሉ ስም*`;
    currentDisplayQuestionNumber++;
    const phoneQuestionLabel = `${currentDisplayQuestionNumber}. ስልክ ቁጥር*`;
    currentDisplayQuestionNumber++;
    const addressQuestionLabel = `${currentDisplayQuestionNumber}. አድራሻ (ከተማ)*`;
    currentDisplayQuestionNumber++;
    const genderQuestionLabel = `${currentDisplayQuestionNumber}. ፆታ*`;


    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-50 text-white text-lg">
                    <div className="spinner"></div> processing...
                </div>
            )}

            {currentPage === 'welcome' && (
                <div className="container bg-white bg-opacity-95 p-8 rounded-lg shadow-xl max-w-xl w-11/12 mx-auto mt-10 mb-10 text-center" id="welcomePage">
                    <h1 className="text-[#ff9900] text-2xl font-bold mb-4">እንኳን ደህና መጡ!</h1>
                    <p className="survey-intro text-gray-700 leading-relaxed mb-6">
                       ይህ መጠይቅ የተዘጋጀው ህይወታቸው ላይ ትላልቅ አውንታዊ ለውጥን በሁሉም የህይወት ዘርፎች ላይ ለማምጣት ዝግጁ ለሆኑ፣ ቀና አስተሳሰብ ላላቸው  ሰዎች ነው።

                    </p>
                    <button
                        className="start-button bg-[#ff9900] hover:bg-[#e68a00] text-white py-3 px-6 rounded-md text-lg font-semibold transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={startSurvey}
                        disabled={isLoading}
                    >
                         {isLoading ? (
                            <>
                                <span className="spinner spinner-small"></span> Loading...
                            </>
                        ) : (
                            'Start Survey'
                        )}
                    </button>
                </div>
            )}

            {currentPage === 'survey' && (
                <div className="container bg-white bg-opacity-95 p-8 rounded-lg shadow-xl max-w-xl w-11/12 mx-auto mt-10 mb-10 text-left" id="surveyContainer">
                    <h3 className="text-orange-500 text-center font-bold mb-6">የቢዝነስ እድል</h3>

                 
                    <form onSubmit={submitSurvey} className="survey-form flex flex-col space-y-6">
                        <div className="question-group border border-gray-300 rounded-lg overflow-hidden" id="questionOneGroup">
                            <label className="question-label block bg-[#55626e] text-white p-4 font-bold text-lg">1. ይህ ቢዝነስ የቢዝነስ ዕድል ለሁሉም ቢደረስም ለሁሉም ግን አይሆንም! እርስዎንም ከዚህ በታች ካሉት ውስጥ ለምን ለእርሶ አንደሚሆን ይምረጡ:</label>
                            <div className="options-group checkbox-group bg-[#f9f9f9] p-5 flex flex-col space-y-3">
                                <label><input type="checkbox" name="questionOne" value="ተጨማሪ ገቢ ስለምፈልግ" onChange={handleInputChange} checked={userData.questionOne.includes("ተጨማሪ ገቢ ስለምፈልግ")} /> ተጨማሪ ገቢ ስለምፈልግ</label>
                                <label><input type="checkbox" name="questionOne" value="አሁን ካለሁበት የተሻለ ቦታ መሆን ስለምፈልግ" onChange={handleInputChange} checked={userData.questionOne.includes("አሁን ካለሁበት የተሻለ ቦታ መሆን ስለምፈልግ")} /> አሁን ካለሁበት የተሻለ ቦታ መሆን ስለምፈልግ</label>
                                <label><input type="checkbox" name="questionOne" value="ለወቅቱ የሚመጥን የገቢ አማረጭ ስለምፈልግ" onChange={handleInputChange} checked={userData.questionOne.includes("ለወቅቱ የሚመጥን የገቢ አማረጭ ስለምፈልግ")} /> ለወቅቱ የሚመጥን የገቢ አማረጭ ስለምፈልግ</label>
                                <label><input type="checkbox" name="questionOne" value="በወጣትነቴ ሀብታም መሆን እና ጡረታ መውጣት ስለምፈልግ" onChange={handleInputChange} checked={userData.questionOne.includes("በወጣትነቴ ሀብታም መሆን እና ጡረታ መውጣት ስለምፈልግ")} /> በወጣትነቴ ሀብታም መሆን እና ጡረታ መውጣት ስለምፈልግ</label>
                                <label><input type="checkbox" name="questionOne" value="ገንዘብ ለማግኘት ሁሌም እኔን የማይፈልግ ሲስተም መገንባት ስለምፈልግ" onChange={handleInputChange} checked={userData.questionOne.includes("ገንዘብ ለማግኘት ሁሌም እኔን የማይፈልግ ሲስተም መገንባት ስለምፈልግ")} /> ገንዘብ ለማግኘት ሁሌም እኔን የማይፈልግ ሲስተም መገንባት ስለምፈልግ</label>
                                <label><input type="checkbox" name="questionOne" value="ከራሴ አልፌ ለብዙ ሰዎች መተረፍ ስለምፈልግ" onChange={handleInputChange} checked={userData.questionOne.includes("ከራሴ አልፌ ለብዙ ሰዎች መተረፍ ስለምፈልግ")} /> ከራሴ አልፌ ለብዙ ሰዎች መተረፍ ስለምፈልግ</label>
                                <label><input type="checkbox" name="questionOne" value="አሁን ካለኝ የቢዝነስ አስተሳሰብ የተሻለ የቢዝነስ አስተሳሰብ እንዲኖረኝ ስለምፈልግ" onChange={handleInputChange} checked={userData.questionOne.includes("አሁን ካለኝ የቢዝነስ አስተሳሰብ የተሻለ የቢዝነስ አስተሳሰብ እንዲኖረኝ ስለምፈልግ")} /> አሁን ካለኝ የቢዝነስ አስተሳሰብ የተሻለ የቢዝነስ አስተሳሰብ እንዲኖረኝ ስለምፈልግ</label>
                                <label><input type="checkbox" name="questionOne" value="በቡድን መስራት ማድገን ስለምመረጥ" onChange={handleInputChange} checked={userData.questionOne.includes("በቡድን መስራት ማድገን ስለምመረጥ")} /> በቡድን መስራት ማድገን ስለምመረጥ</label>
                                <label><input type="checkbox" name="questionOne" value="አሁን ባለኝ እውቀት ፣ ችሎታ ፣ ገንዘብ እና ሙያ ብቻ የምሰራው ቢዝነስ ስለምፈልግ" onChange={handleInputChange} checked={userData.questionOne.includes("አሁን ባለኝ እውቀት ፣ ችሎታ ፣ ገንዘብ እና ሙያ ብቻ የምሰራው ቢዝነስ ስለምፈልግ")} /> አሁን ባለኝ እውቀት ፣ ችሎታ ፣ ገንዘብ እና ሙያ ብቻ የምሰራው ቢዝነስ ስለምፈልግ</label>
                                <label><input type="checkbox" name="questionOne" value="የትም መቼም ልሰራው የምችለው ቢዝነስ ስለምፈልግ" onChange={handleInputChange} checked={userData.questionOne.includes("የትም መቼም ልሰራው የምችለው ቢዝነስ ስለምፈልግ")} /> የትም መቼም ልሰራው የምችለው ቢዝነስ ስለምፈልግ</label>
                            </div>
                        </div>

                        <div className="question-group border border-gray-300 rounded-lg overflow-hidden">
                            <label className="question-label block bg-[#55626e] text-white p-4 font-bold text-lg">2. በምን ስራ ላይ ተሰማረተዎል?</label>
                            <div className="options-group radio-group bg-[#f9f9f9] p-5 flex flex-col space-y-3">
                                <label><input type="radio" name="usersJob" value="ትምህርት" required onChange={handleInputChange} checked={userData.usersJob === 'ትምህርት'}/> ትምህርት</label>
                                <label><input type="radio" name="usersJob" value="ስራ" required onChange={handleInputChange} checked={userData.usersJob === 'ስራ'}/> ስራ</label>
                                <label><input type="radio" name="usersJob" value="ምንም" required onChange={handleInputChange} checked={userData.usersJob === 'ምንም'}/> ምንም</label>
                                <label><input type="radio" name="usersJob" value="ተማሪም ሰራተኛም" required onChange={handleInputChange} checked={userData.usersJob === 'ተማሪም ሰራተኛም'}/> ተማሪም ሰራተኛም</label>
                                {(userData.usersJob && !['ትምህርት', 'ስራ', 'ምንም', 'ተማሪም ሰራተኛም'].includes(userData.usersJob)) || userData.usersJobOther ? (
                                     <input
                                        type="text"
                                        name="usersJobOther"
                                        placeholder="other"
                                        onChange={handleInputChange}
                                        className="other-input w-full p-2 border border-gray-300 rounded mt-2"
                                        value={userData.usersJobOther}
                                        required={userData.usersJob === ''}
                                     />
                                ) : null}
                            </div>
                        </div>

                        {showJobTypeQuestion && jobTypeQuestionLabel && (
                             <div className="question-group border border-gray-300 rounded-lg overflow-hidden">
                                <label className="question-label block bg-[#55626e] text-white p-4 font-bold text-lg">{jobTypeQuestionLabel}</label>
                                <div className="options-group radio-group bg-[#f9f9f9] p-5 flex flex-col space-y-3">
                                    <label><input type="radio" name="jobType" value="የግል" onChange={handleInputChange} required={showJobTypeQuestion} checked={userData.jobType === 'የግል'}/> የግል</label>
                                    <label><input type="radio" name="jobType" value="በቅጥር" onChange={handleInputChange} required={showJobTypeQuestion} checked={userData.jobType === 'በቅጥር'}/> በቅጥር</label>
                                    <label><input type="radio" name="jobType" value="ሁለቱም" onChange={handleInputChange} required={showJobTypeQuestion} checked={userData.jobType === 'ሁለቱም'}/> Both</label>
                                     {(userData.jobType && !['የግል', 'በቅጥር', 'ሁለቱም'].includes(userData.jobType)) || userData.jobTypeOther ? (
                                        <input
                                            type="text"
                                            name="jobTypeOther"
                                            placeholder="other"
                                            onChange={handleInputChange}
                                            className="other-input w-full p-2 border border-gray-300 rounded mt-2"
                                            value={userData.jobTypeOther}
                                            required={showJobTypeQuestion && userData.jobType === ''}
                                         />
                                    ) : null}
                                </div>
                            </div>
                        )}

                        {showEducationLevelQuestion && educationLevelQuestionLabel && (
                            <div className="question-group border border-gray-300 rounded-lg overflow-hidden">
                                <label className="question-label block bg-[#55626e] text-white p-4 font-bold text-lg">{educationLevelQuestionLabel}</label>
                                <div className="options-group radio-group bg-[#f9f9f9] p-5 flex flex-col space-y-3">
                                    <label><input type="radio" name="levelOfEducation" value="ፕሪፓራቶሪ" required={showEducationLevelQuestion} onChange={handleInputChange} checked={userData.levelOfEducation === 'ፕሪፓራቶሪ'}/> ፕሪፓራቶሪ</label>
                                    <label><input type="radio" name="levelOfEducation" value="ኮሌጅ / ዩንቨርስቲ" required={showEducationLevelQuestion} onChange={handleInputChange} checked={userData.levelOfEducation === 'ኮሌጅ / ዩንቨርስቲ'}/> ኮሌጅ / ዩንቨርስቲ</label>
                                    {(userData.levelOfEducation && !['ፕሪፓራቶሪ', 'ኮሌጅ / ዩንቨርስቲ'].includes(userData.levelOfEducation)) || userData.levelOfEducationOther ? (
                                        <input
                                            type="text"
                                            name="levelOfEducationOther"
                                            placeholder="other"
                                            onChange={handleInputChange}
                                            className="other-input w-full p-2 border border-gray-300 rounded mt-2"
                                            value={userData.levelOfEducationOther}
                                            required={showEducationLevelQuestion && userData.levelOfEducation === ''}
                                         />
                                    ) : null}
                                </div>
                            </div>
                        )}

                         {wayOfGettingInfoQuestionLabel && (
                             <div className="question-group border border-gray-300 rounded-lg overflow-hidden">
                                 <label className="question-label block bg-[#55626e] text-white p-4 font-bold text-lg">{wayOfGettingInfoQuestionLabel}</label>
                                <div className="options-group radio-group bg-[#f9f9f9] p-5 flex flex-col space-y-3">
                                    <label><input type="radio" name="wayOfGettingInfo" value="በአካል" required onChange={handleInputChange} checked={userData.wayOfGettingInfo === 'በአካል'}/> በአካል</label>
                                    <label><input type="radio" name="wayOfGettingInfo" value="በስልክ" required onChange={handleInputChange} checked={userData.wayOfGettingInfo === 'በስልክ'}/> በስልክ</label>
                                    <label><input type="radio" name="wayOfGettingInfo" value="በቴሌግራም" required onChange={handleInputChange} checked={userData.wayOfGettingInfo === 'በቴሌግራም'}/> በቴሌግራም</label>
                                    {(userData.wayOfGettingInfo && !['በአካል', 'በስልክ', 'በቴሌግራም'].includes(userData.wayOfGettingInfo)) || userData.wayOfGettingInfoOther ? (
                                        <input
                                            type="text"
                                            name="wayOfGettingInfoOther"
                                            placeholder="other"
                                            onChange={handleInputChange}
                                            className="other-input w-full p-2 border border-gray-300 rounded mt-2"
                                            value={userData.wayOfGettingInfoOther}
                                            required={userData.wayOfGettingInfo === ''}
                                         />
                                    ) : null}
                                </div>
                            </div>
                         )}

                        <div className="question-group border border-gray-300 rounded-lg overflow-hidden">
                            <label htmlFor="fullname" className="question-label block bg-[#55626e] text-white p-4 font-bold text-lg">{fullnameQuestionLabel}</label>
                            <div className="p-5 bg-[#f9f9f9]">
                                <input
                                    id="fullname"
                                    type="text"
                                    name="fullname"
                                    placeholder="የእርስዎን ሙሉ ስም ይጻፉ"
                                    required
                                    onChange={handleInputChange}
                                    value={userData.fullname}
                                    className="text-input w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>

                        <div className="question-group border border-gray-300 rounded-lg overflow-hidden">
                            <label htmlFor="phone" className="question-label block bg-[#55626e] text-white p-4 font-bold text-lg">{phoneQuestionLabel}</label>
                             <div className="p-5 bg-[#f9f9f9]">
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="የእርስዎን ስልክ ቁጥር (09... ወይ +2519...)"
                                    required
                                    onChange={handleInputChange}
                                    value={userData.phone}
                                    className="text-input w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>

                        <div className="question-group border border-gray-300 rounded-lg overflow-hidden">
                            <label htmlFor="address" className="question-label block bg-[#55626e] text-white p-4 font-bold text-lg">{addressQuestionLabel}</label>
                             <div className="p-5 bg-[#f9f9f9]">
                                <input
                                    id="address"
                                    type="text"
                                    name="address"
                                    placeholder="የእርስዎን ከተማ ይጻፉ"
                                    required
                                    onChange={handleInputChange}
                                    value={userData.address}
                                    className="text-input w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>

                        <div className="question-group border border-gray-300 rounded-lg overflow-hidden">
                            <label className="question-label block bg-[#55626e] text-white p-4 font-bold text-lg">{genderQuestionLabel}</label>
                            <div className="options-group radio-group bg-[#f9f9f9] p-5 flex flex-col space-y-3">
                                <label><input type="radio" name="gender" value="ወንድ" required onChange={handleInputChange} checked={userData.gender === 'ወንድ'}/> ወንድ</label>
                                <label><input type="radio" name="gender" value="ሴት" required onChange={handleInputChange} checked={userData.gender === 'ሴት'}/> ሴት</label>
                            </div>
                        </div>

                        <button type="submit" className="submit-button bg-[#ff9900] hover:bg-[#e68a00] text-white py-3 px-6 rounded-md text-lg font-semibold transition duration-300 w-full text-center disabled:bg-gray-400 disabled:cursor-not-allowed mt-4">
                            {isSubmitting ? (
                                <>
                                    <span className="spinner spinner-small"></span> Submitting...
                                </>
                            ) : (
                                "አስተያየት ይላኩ"
                            )}
                        </button>
                    </form>
                </div>
            )}

            {currentPage === 'thankyou' && (
                <div className="container bg-white bg-opacity-95 p-8 rounded-lg shadow-xl max-w-xl w-11/12 mx-auto mt-10 mb-10 text-center" id="thankYouMessage">
                     <h1 className="text-green-600 text-2xl font-bold mb-4">እናመሰግናለን!</h1>
                    <p className="text-gray-700 leading-relaxed">We greatly appreciate you taking the time to complete the survey. You will be redirected shortly.</p>
                </div>
            )}

        </>
    );
};

export default Surveys;