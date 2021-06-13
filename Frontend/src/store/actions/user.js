
import { apiCall } from '../../services/api';
import { EDIT_INTERNSHIP, DELETE_INTERNSHIP, CREATE_INTERNSHIP, DELETE_USER_PROJECT, DELETE_USER_CERTIFICATE, EDIT_EVENT, DELETE_EVENT, DELETE_USER_ACHIEVEMENT, EDIT_USER_ACHIEVEMENT, UPDATE_USER_ACHIEVEMENT, DELETE_USER_EXPERIENCE, EDIT_USER_EXPERIENCE, EDIT_USER_PROJECT, UPDATE_USER_SKILLS, UPDATE_USER_PROJECT, UPDATE_USER_EXPERIENCE, UPDATE_USER_CERTIFICATES, UPDATE_USER_BASIC_INFO, UPDATE_USER_INFO, ADD_BOOKMARK, DELETE_BOOKMARK, ADD_MEMBER, DELETE_MEMBER, UPDATE_EVENT, UPDATE_RECRUITED, LIKE_ACTIVITY, COMMENT_ACTIVITY, UNLIKE_ACTIVITY, UPDATE_USER_PHOTO, INTERNSHIP_APPLY } from '../actionTypes';



function userSkills(skills) {
    return {
        type: UPDATE_USER_SKILLS,
        skills
    }
}
export function updateSkills(skills, id) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', '/profile/update/skills', { skills, id })
                .then(() => {
                    dispatch(userSkills(skills));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}

function userinfo(user) {
    return {
        type: UPDATE_USER_INFO,
        user
    }
}

export function updateinfo(data) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', "/profile/update/basicinfo", data)
                .then(() => {
                    dispatch(userinfo(data.user));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}

function userbasicinfo(user) {
    return {
        type: UPDATE_USER_BASIC_INFO,
        user
    }
}

export function updatebasicinfo(data) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', "/profile/update/basicinfo", data)
                .then(() => {
                    dispatch(userbasicinfo(data.user));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}

function userCertificates(certificate) {
    return {
        type: UPDATE_USER_CERTIFICATES,
        certificate
    }
}
export function updateCertificates(certificate, id) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', '/profile/update/certificates', { certificate, id })
                .then((newCertificate) => {
                    dispatch(userCertificates(newCertificate));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
function userCertificatedelete(cert_id) {
    return {
        type: DELETE_USER_CERTIFICATE,
        cert_id
    }
}
export function deleteCertificate(cert_id, id) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('delete', '/profile/update/certificates/' + id + '/' + cert_id)
                .then(() => {
                    dispatch(userCertificatedelete(cert_id));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
function userExperience(experience) {
    return {
        type: UPDATE_USER_EXPERIENCE,
        experience
    }
}
export function updateExperiences(experience, id) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', '/profile/update/experiences', { experience, id })
                .then((newExperience) => {
                    dispatch(userExperience(newExperience));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
function userExperiencedelete(expId) {
    return {
        type: DELETE_USER_EXPERIENCE,
        expId
    }
}
export function deleteExperiences(expId, id) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('delete', '/profile/update/experiences/' + id + '/' + expId)
                .then(() => {
                    dispatch(userExperiencedelete(expId));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
function userExperienceEdit(experience) {
    return {
        type: EDIT_USER_EXPERIENCE,
        experience
    }
}
export function editExperience(experience) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', '/profile/edit/experience', experience)
                .then(() => {
                    dispatch(userExperienceEdit(experience.experience));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
function userProject(project) {
    return {
        type: UPDATE_USER_PROJECT,
        project
    }
}
export function updateProjects(project, id) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', '/profile/update/projects', { project, id })
                .then((newProject) => {
                    dispatch(userProject(newProject));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
function userProjectdelete(projectId) {
    return {
        type: DELETE_USER_PROJECT,
        projectId
    }
}
export function deleteProjects(projectId, id) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('delete', '/profile/update/projects/' + id + '/' + projectId)
                .then(() => {
                    dispatch(userProjectdelete(projectId));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
function userProjectedit(project) {
    return {
        type: EDIT_USER_PROJECT,
        project
    }
}
export function editProjects(project) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', '/profile/edit/project', project)
                .then(() => {
                    dispatch(userProjectedit(project.project));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
function addBook(bookmark) {
    return {
        type: ADD_BOOKMARK,
        bookmark
    }
}

export function addBookmark(bookmark, userId) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', '/internship/bookmark/add/' + bookmark, { userId })
                .then(() => {
                    dispatch(addBook(bookmark));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}

function deleteBook(bookmark) {
    return {
        type: DELETE_BOOKMARK,
        bookmark
    }
}

export function deleteBookmark(bookmark, userId) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', '/internship/bookmark/delete/' + bookmark, { userId })
                .then(() => {
                    dispatch(deleteBook(bookmark));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}


function addMemb(member) {
    return {
        type: ADD_MEMBER,
        member
    }
}
export function addMember(member, id) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', '/council/addMember/' + id, member)
                .then((newMember) => {
                    newMember.member = {
                        _id: newMember.member._id,
                        ...member.member
                    }
                    console.log(newMember);
                    dispatch(addMemb(newMember));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}

function deleteMemb(memberId) {
    return {
        type: DELETE_MEMBER,
        memberId
    }
}
export function deleteMember(memberId, userId) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('delete', '/council/deleteMember/' + userId + '/' + memberId, '')
                .then(() => {
                    dispatch(deleteMemb(memberId));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
function addEv(event) {
    return {
        type: UPDATE_EVENT,
        event
    }
}

export function addEvent(event, userId) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('post', '/council/addEvent/' + userId, event)
                .then((newEvent) => {
                    dispatch(addEv(newEvent));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
function userEventDelete(eventId) {
    return {
        type: DELETE_EVENT,
        eventId
    }
}
export function deleteEvent(eventId, id) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('delete', '/council/deleteEvent/' + id + '/' + eventId)
                .then(() => {
                    dispatch(userEventDelete(eventId));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
function usereventedit(event) {

    return {
        type: EDIT_EVENT,
        event
    }
}
export function editEvent(event) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', '/council/editEvent', event)
                .then(() => {
                    dispatch(usereventedit(event.event));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}

function userachievement(achievement) {
    return {
        type: UPDATE_USER_ACHIEVEMENT,
        achievement
    }
}
export function updateAchievement(achievement, id) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', '/profile/update/achievements', { achievement, id })
                .then((newachm) => {
                    dispatch(userachievement(newachm));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
function userachievementdelete(achmId) {
    return {
        type: DELETE_USER_ACHIEVEMENT,
        achmId
    }
}
export function deleteAchievement(achmId, id) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('delete', '/profile/update/achievements/' + id + '/' + achmId)
                .then(() => {
                    dispatch(userachievementdelete(achmId));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
function userachievementedit(achievement) {
    return {
        type: EDIT_USER_ACHIEVEMENT,
        achievement
    }
}
export function editAchievement(achievement) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', '/profile/edit/achievement', achievement)
                .then(() => {
                    dispatch(userachievementedit(achievement.achievement));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}


function updateRecruit(recruited, internship) {
    return {
        type: UPDATE_RECRUITED,
        recruited,
        internship
    }
}
export function updateRecruited(userId, selecteduser, internship) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', "/internship/recruited/" + internship, { userId, selecteduser })
                .then(() => {
                    dispatch(updateRecruit(selecteduser, internship));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}
export function updateLikeActivity(activity) {
    return {
        type: LIKE_ACTIVITY,
        activity
    }
}

export function updateUnLikeActivity(postId) {
    return {
        type: UNLIKE_ACTIVITY,
        postId
    }
}
export function updateCommentActivity(activity) {
    return {
        type: COMMENT_ACTIVITY,
        activity
    }
}

function updatePhoto(photo, photoId) {
    return {
        type: UPDATE_USER_PHOTO,
        photo,
        photoId
    }
}
export function updateUserPhoto(fd) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('put', '/profile/update/photo', fd)
                .then((response) => {
                    console.log(response);
                    dispatch(updatePhoto(response.photo, response.photoId));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}

function updateApplications(application) {
    return {
        type: INTERNSHIP_APPLY,
        application
    }
}

export function internshipApply(internshipDetail, faculty) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            return apiCall('post', '/internship/apply', internshipDetail)
                .then((application) => {
                    application.facultyId = faculty;
                    dispatch(updateApplications(application));
                    resolve();
                })
                .catch(err => reject(err));
        })
    }
}

export function updateOffered(internship) {
    return {
        type: CREATE_INTERNSHIP,
        internship
    }
}
export function internshipCreate(internshipDetail) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            return apiCall("post", '/internship/details', internshipDetail)
                .then((internship) => {
                    console.log(internship)
                    internship.faculty = internshipDetail.faculty;
                    dispatch(updateOffered(internship));
                    resolve(internship._id);
                })
                .catch(err => reject(err));
        })
    }
}

export function deleteinternship(intId) {
    return {
        type: DELETE_INTERNSHIP,
        intId
    }
}
export function internshipDelete(intId, userId) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            return apiCall("delete", '/internship/details/' + intId + '/' + userId)
                .then(() => {
                    dispatch(deleteinternship(intId));
                    resolve();
                })
                .catch(err => reject(err));
        })
    }
}

export function editinternship(internship) {
    return {
        type: EDIT_INTERNSHIP,
        internship
    }
}
export function internshipedit(internship, userId) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            return apiCall("put", '/internship/details/', { id: userId, data: internship })
                .then(() => {
                    dispatch(editinternship(internship));
                    resolve(internship._id);
                })
                .catch(err => reject(err));
        })
    }
}