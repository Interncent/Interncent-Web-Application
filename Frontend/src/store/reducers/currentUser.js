import { EDIT_INTERNSHIP, DELETE_INTERNSHIP, SET_CURRENT_USER, DELETE_USER_PROJECT, DELETE_USER_CERTIFICATE, DELETE_USER_ACHIEVEMENT, EDIT_USER_ACHIEVEMENT, UPDATE_USER_ACHIEVEMENT, EDIT_EVENT, DELETE_EVENT, DELETE_USER_EXPERIENCE, EDIT_USER_EXPERIENCE, EDIT_USER_PROJECT, UPDATE_USER_SKILLS, UPDATE_USER_REFRESH, UPDATE_USER_PROJECT, UPDATE_USER_EXPERIENCE, UPDATE_USER_CERTIFICATES, UPDATE_USER_BASIC_INFO, UPDATE_USER_INFO, ADD_BOOKMARK, DELETE_BOOKMARK, ADD_MEMBER, DELETE_MEMBER, UPDATE_EVENT, UPDATE_RECRUITED, LIKE_ACTIVITY, UNLIKE_ACTIVITY, COMMENT_ACTIVITY, UPDATE_USER_PHOTO, INTERNSHIP_APPLY, CREATE_INTERNSHIP } from '../actionTypes';

const defaultState = {
    isAuthenticated: false,
    user: {}
}
const currentUserReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                isAuthenticated: !!Object.keys(action.user).length,
                user: action.user
            }
        case UPDATE_USER_REFRESH:
            // state.user.projects=action.user.projects
            return {
                isAuthenticated: true,
                user: action.user
            }
        case UPDATE_USER_SKILLS:
            state.user.skills = action.skills;
            return {
                ...state
            }
        case UPDATE_USER_INFO:
            if (state.user.role === "Student") {
                state.user.year = action.user.year;
                state.user.rollNo = action.user.rollNo;
                state.user.dept = action.user.dept;

            } else if (state.user.role === "Faculty") {
                state.user.dept = action.user.dept;
                state.user.position = action.user.position

            } else {
                state.user.passedOut = action.user.passedOut;
                state.user.workingAt = action.user.workingAt;
                state.user.position = action.user.position;
            }

            return {
                ...state
            }
        case UPDATE_USER_CERTIFICATES:
            state.user.certificates.push(action.certificate);
            return {
                ...state
            }
        case DELETE_USER_CERTIFICATE:
            state.user.certificates = state.user.certificates.filter((m) => String(m._id) !== String(action.cert_id));
            return {
                ...state
            }
        case UPDATE_USER_EXPERIENCE:
            state.user.experiences.push(action.experience);
            return {
                ...state
            }
        case DELETE_USER_EXPERIENCE:
            state.user.experiences = state.user.experiences.filter((m) => String(m._id) !== String(action.expId));
            return {
                ...state
            }
        case EDIT_USER_EXPERIENCE:
            let index = state.user.experiences.findIndex((m) => String(m._id) === String(action.experience._id));
            state.user.experiences[index] = action.experience
            return {
                ...state
            }
        case UPDATE_USER_PROJECT:
            state.user.projects.push(action.project);
            return {
                ...state
            }
        case DELETE_USER_PROJECT:
            state.user.projects = state.user.projects.filter((m) => String(m._id) !== String(action.projectId));
            return {
                ...state
            }
        case EDIT_USER_PROJECT:
            let index2 = state.user.projects.findIndex((m) => String(m._id) === String(action.project._id));
            state.user.projects[index2] = action.project
            return {
                ...state
            }
        case UPDATE_USER_BASIC_INFO:
            state.user.bio = action.user.bio;
            state.user.fname = action.user.fname;
            state.user.lname = action.user.lname;
            state.user.socialHandles = action.user.socialHandles;
            return {
                ...state
            }
        case ADD_BOOKMARK:
            state.user.bookmarks.push(action.bookmark);
            return {
                ...state
            }
        case DELETE_BOOKMARK:
            state.user.bookmarks = state.user.bookmarks.filter(b => b !== action.bookmark);
            return {
                ...state
            }
        case ADD_MEMBER:
            state.user.members.push(action.member);
            return {
                ...state
            }
        case DELETE_MEMBER:
            state.user.members = state.user.members.filter(b => b._id !== action.memberId)
            return {
                ...state
            }
        case UPDATE_EVENT:
            state.user.events.push(action.event);
            return {
                ...state
            }
        case DELETE_EVENT:
            state.user.events = state.user.events.filter(e => e._id !== action.eventId)
            return {
                ...state
            }
        case EDIT_EVENT:
            let index3 = state.user.events.findIndex((m) => String(m._id) === String(action.event._id));
            state.user.events[index3] = action.event
            return {
                ...state
            }
        case UPDATE_USER_ACHIEVEMENT:
            state.user.achievements.push(action.achievement);
            return {
                ...state
            }
        case DELETE_USER_ACHIEVEMENT:
            state.user.achievements = state.user.achievements.filter((m) => String(m._id) !== String(action.achmId));
            return {
                ...state
            }
        case EDIT_USER_ACHIEVEMENT:
            let index4 = state.user.achievements.findIndex((m) => String(m._id) === String(action.achievement._id));
            state.user.achievements[index4] = action.achievement
            return {
                ...state
            }
        case UPDATE_RECRUITED:
            console.log(action.internship)
            state.user.internshipsOffered.forEach(i => {
                if (i._id === action.internship) {
                    i.recruited = action.recruited;
                    console.log('hEllo');
                    return;
                }
            });
            return {
                ...state
            }
        case LIKE_ACTIVITY:
            state.user.liked.push(action.activity);
            return {
                ...state
            }
        case UNLIKE_ACTIVITY:
            state.user.liked = state.user.liked.filter(p => p.post._id !== action.postId);
            return {
                ...state
            }
        case COMMENT_ACTIVITY:
            state.user.commented.push(action.activity);
            return {
                ...state
            }
        case UPDATE_USER_PHOTO:
            state.user.photo = action.photo;
            state.user.photoId = action.photoId;
            return {
                ...state
            }
        case INTERNSHIP_APPLY:
            state.user.applications.push(action.application);
            return {
                ...state
            }
        case CREATE_INTERNSHIP:
            state.user.internshipsOffered.push(action.internship)
            return {
                ...state
            }
        case EDIT_INTERNSHIP:
            let index5 = state.user.internshipsOffered.findIndex((m) => String(m._id) === String(action.internship._id));
            state.user.internshipsOffered[index5] = action.internship
            return {
                ...state
            }
        case DELETE_INTERNSHIP:
            state.user.internshipsOffered = state.user.internshipsOffered.filter((m) => String(m._id) !== String(action.intId));
            return {
                ...state
            }
        default:
            return state
    }
}
export default currentUserReducer;


