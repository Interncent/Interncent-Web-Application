import React from 'react';

const Features = (props) => {
    return (
        <div className="features">
            <div className="heading">Features</div>
            <ul className="featuresList">
                <li className="featuresItem"><i className="fas fa-graduation-cap leftIcon"></i>
                    KJSCE Connect provides you with an extensive platform where faculty of your college can float internships and you can enroll in them based on your skills.
                </li>
                <li className="featuresItem">
                    Once you are enrolled in an internhsip, an Internhsip tab is created which is accessible by the faculty of our internship and it can be used for prompting your progeress in the internship and by faculty for giving remarks on your progress.
                    <i className="fas fa-users rightIcon"></i>
                </li>

                <li className="featuresItem">
                    <i className="fas fa-globe leftIcon"></i>
                    KJSCE Connect Community comprises of Somaiya Family brought together with the help of internet. Here you can showcase your achivements, float important notices, or ask for collabrations.
                    Its baciscally like a social media for KJSCE.
                </li>
                <li className="featuresItem">
                    KJSCE Connect Messanger can be used for direct communication with faculty and students. It can be used by the student to ask queries regarding the internships from the faculty or communicate with other students regaring collabrations or other issues.
                    <i className="fas fa-envelope rightIcon"></i>
                </li>
            </ul>
        </div >
    )
}
export default Features;