import React from "react";
import Modal from "react-bootstrap/Modal";
import { connect } from 'react-redux'
import { updatebasicinfo, updateUserPhoto, updateResumeLink } from '../../store/actions/user'
import { Spinner } from 'react-bootstrap'
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop from 'react-image-crop';
import { base64StringtoFile, image64toCanvasRef, extractImageFileExtensionFromBase64 } from './ImageCropUtils';
import { Link } from 'react-router-dom'
import LinkedInPage from './linkedin'

const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg';
const acceptedFileTypesArray = acceptedFileTypes.split(',').map(item => item.trim());



class Basic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      show2: false,
      show3: false,
      userdata: {
        fname: this.props.user.fname,
        lname: this.props.user.lname,
        bio: this.props.user.bio,
        facebook: this.props.user.socialHandles.facebook,
        twitter: this.props.user.socialHandles.twitter,
        linkedin: this.props.user.socialHandles.linkedin,
        github: this.props.user.socialHandles.github,
      },
      fileLabel: 'Choose Image to Upload',
      status: '',
      crop: {
        aspect: 1 / 1.11
      },
      cropped: false,
      startedCropping: false,
      imgSrc: null,
      error: null,
      resume: this.props.user.resume
    };
    this.fileLabel = React.createRef();
    this.imagePreviewCanvas = React.createRef();
    this.handleshow = (e) => {
      this.setState({ show: true });
    };
    this.handleClose = (e) => {
      this.setState({ show: false });
    };
    this.handleshow2 = (e) => {
      this.setState({ show2: true });
    };
    this.handleClose2 = (e) => {
      this.setState({ show2: false });
    };
    this.handleshow3 = (e) => {
      this.setState({ show3: true });
    };
    this.handleClose3 = (e) => {
      this.setState({ show3: false });
    };
    this.handleSubmit = (e) => {
      e.preventDefault();
      let data = {
        id: this.props.user._id,
        user: {
          fname: this.state.userdata.fname,
          lname: this.state.userdata.lname,
          bio: this.state.userdata.bio,
          socialHandles: {
            facebook: this.state.userdata.facebook,
            twitter: this.state.userdata.twitter,
            linkedin: this.state.userdata.linkedin,
            github: this.state.userdata.github,
          }
        }

      };
      console.log(data)
      props.updatebasicinfo(data).then(() => this.handleClose());

    };
    this.handleChange = (e) => {
      let userdata = this.state.userdata;
      userdata[e.target.name] = e.target.value;
      this.setState({ userdata });
    };

    // Handle Resume Upload
    this.handleResume = (e) => {
      e.preventDefault()
      this.props.updateResumeLink(this.props.user._id, this.state.resume)
        .then((result) => {
          this.handleClose3()
        }).catch((err) => {
          console.log(err)
        });
    }

    this.handleChangeResume = e => {
      this.setState({ resume: e.target.value })
    }

    this.handleImageUpload = async (e) => {
      e.preventDefault();
      const canvasRef = this.imagePreviewCanvas.current;
      const { imgSrcExs } = this.state;
      const fileName = this.props.user.email.split('@')[0] + "." + imgSrcExs;
      this.setState({ status: 'uploading' });
      const image64 = canvasRef.toDataURL('/image/' + imgSrcExs);
      const newCroppedFile = base64StringtoFile(image64, fileName);
      console.log(newCroppedFile);
      const data = new FormData()
      await data.append('file', newCroppedFile);
      await data.append('id', this.props.currentUser.user._id)
      this.props.updateUserPhoto(data).then(() => {
        console.log('Image Uploaded');
        this.handleClose2();
        this.handleClearToDefult();
      }).catch(err => {
        this.state.error = 'File Type is Not Supported'
      })
    }
    this.verifyFile = (fi) => {

      for (let i = 0; i <= fi.files.length - 1; i++) {
        let fsize = fi.files.item(i).size;
        let file = Math.round(fsize / 1024);
        // The size of the file.
        var fullPath = fi.value;
        if (fullPath) {
          var startIndex =
            fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/');
          var filename = fullPath.substring(startIndex);
          if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
          }
          this.fileLabel.current.innerHTML =
            `${filename} ( <b> ${file} </b> KB )`;
        }
        return file

      }
    }
    this.fileValidation = async (e) => {
      if (e.target.files && e.target.files[0]) {
        const fileSize = await this.verifyFile(e.target);
        if (fileSize <= 187) {
          if (acceptedFileTypesArray.includes(e.target.files[0].type)) {
            const selectedFile = e.target.files[0];
            var reader = new FileReader();
            reader.onload = async (el) => {
              this.setState({ imgSrc: el.target.result, imgSrcExs: extractImageFileExtensionFromBase64(el.target.result), cropped: false, startedCropping: false, crop: { aspect: 1 / 1.11 }, error: null })
            };
            reader.readAsDataURL(selectedFile);
          } else {
            console.log(this.state.error);
            await this.setState({ error: 'This File Type is not Alloed', imgSrc: null, imgSrcExs: null });
            console.log(this.state.error);
          }
        } else {
          await this.setState({ imgSrcExs: null, error: 'File Exceeds 2MB', imgSrc: null })
          console.log(this.state.error);
        }
      }
    }
    // Image Cropping
    this.handleOnCropChange = (crop) => {
      if (this.state.startedCropping) {
        return this.setState({ crop, cropped: true });
      } else {
        return this.setState({ crop, startedCropping: true })
      }
    }
    this.handleImageLoaded = (image) => {
      console.log(image);
    }
    this.handleOnCropComplete = (crop, pixelCrop) => {
      const canvasRef = this.imagePreviewCanvas.current;
      const { imgSrc } = this.state;
      image64toCanvasRef(canvasRef, imgSrc, crop);
    }

    this.handleClearToDefult = () => {
      const canvas = this.imagePreviewCanvas.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.setState({ status: '', imgSrc: null, imgSrcExs: null, crop: { aspect: 1 / 1.11 }, cropped: false, startedCropping: false });
    }
  }
  render() {
    const { error } = this.state;
    const {
      bio,
      fname,
      lname,
      facebook,
      twitter,
      linkedin,
      github,
    } = this.state.userdata;
    const { imgSrc } = this.state
    return (
      // <div className="page-heading">
      //   <div className="coverPhoto">

      //   </div>
      //   <div className="media clearfix">
      //     <div className="media-left">
      //       <img
      //         className="mw150"
      //         src={this.props.user.photo}
      //         alt="..."
      //       />
      //       {this.props.owner && <div className="uploadBtn" onClick={this.handleshow2}>Update</div>}
      //       <Modal show={this.state.show2} onHide={this.handleClose2} centered>
      //         <Modal.Header closeButton>
      //           <Modal.Title>Update Profile Picture</Modal.Title>
      //         </Modal.Header>
      //         <Modal.Body>
      //           <form onSubmit={this.handleImageUpload} enctype="multipart/form-data" name="uploadForm" className="form-group imageUploadForm">
      //             <div className="input-group">
      //               <div className="custom-file">
      //                 <label className="custom-file-label" style={{ textAlign: "left" }} ref={this.fileLabel}>{this.state.fileLabel}</label>
      //                 <input type="file" id="file" name="file" onChange={this.fileValidation} className="custom-file-input" style={{ outline: "none", border: "none" }} accept={acceptedFileTypes} required />
      //                 <input type="hidden" name="id" value={this.props.currentUser.user._id}></input>
      //               </div>
      //             </div>


      //             <br></br>
      //             {imgSrc !== null &&
      //               <div>
      //                 <h5>Crop Image</h5>
      //                 <ReactCrop
      //                   src={imgSrc}
      //                   crop={this.state.crop}
      //                   onChange={this.handleOnCropChange}
      //                   onImageLoaded={this.handleImageLoaded}
      //                   onComplete={this.handleOnCropComplete}
      //                 />

      //                 <h5>Preview Cropped Image</h5>

      //                 <canvas ref={this.imagePreviewCanvas}></canvas>
      //               </div>
      //             }
      //             {this.state.cropped === true &&
      //               <div style={{ display: "flex", alignItems: 'center' }}>
      //                 <button className="ui button uploadImageBtn">Upload</button>
      //                 {
      //                   this.state.status === "uploading" &&
      //                   <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      //                     <Spinner animation="border" variant="warning" ></Spinner>
      //                     <span className="ml-2">Uploading you beautiful Photo....</span>
      //                   </div>
      //                 }
      //                 {this.state.error !== null &&
      //                   <div style={{ color: 'red' }}>
      //                     {error}
      //                   </div>
      //                 }
      //               </div>

      //             }

      //           </form>
      //         </Modal.Body>
      //       </Modal>
      //     </div>
      //     <div className="media-body va-m">
      //       <div className="media-heading">
      //         {this.props.user.fname + " " + this.props.user.lname}
      //         <small> - {this.props.user.role}</small>
      //       </div>

      //       {this.props.owner ?<span>
      //         <button className="ui button" id="resumeBtn" onClick={this.handleshow3}>Resume</button>
      //         {/* <LinkedInPage></LinkedInPage> */}
      //         </span>
      //         :
      //         <Link className="ui button" id="resumeBtn" to={'/createchat/' + this.props.user._id}>Message</Link>
      //       }
      //       <p className="lead">{this.props.user.bio}</p>
      //       {this.props.user.socialHandles !== {} &&
      //         <div className="media-links">
      //           <ul className="list-inline list-unstyled">
      //             {this.props.user.socialHandles.facebook !== "" && (
      //               <li>
      //                 <a target="_blank" rel="noreferrer" href={this.props.user.socialHandles.facebook} title="facebook link">
      //                   <span className="fa fa-facebook-square fs35 text-primary"></span>
      //                 </a>
      //               </li>
      //             )}
      //             {this.props.user.socialHandles.twitter !== "" && (
      //               <li>
      //                 <a target="_blank" rel="noreferrer" href={this.props.user.socialHandles.twitter} title="twitter link">
      //                   <span className="fa fa-twitter-square fs35 text-info"></span>
      //                 </a>
      //               </li>
      //             )}
      //             {this.props.user.socialHandles.linkedin !== "" && (
      //               <li className="hidden">
      //                 <a target="_blank" rel="noreferrer" href={this.props.user.socialHandles.linkedin} title="linkedin link">
      //                   <span className="fa fa-linkedin-square fs35 text-info"></span>
      //                 </a>
      //               </li>
      //             )}
      //             {this.props.user.socialHandles.github !== "" && (
      //               <li className="hidden">
      //                 <a target="_blank" rel="noreferrer" href={this.props.user.socialHandles.github} title="github link">
      //                   <span className="fa fa-github-square fs35 text-dark"></span>
      //                 </a>
      //               </li>
      //             )}
      //             <li>
      //               <a target="_blank" rel="noreferrer"
      //                 href={"mailto:" + this.props.user.email}
      //                 title="email link"
      //               >
      //                 <span className="fa fa-envelope-square fs35 text-muted"></span>
      //               </a>
      //             </li>
      //           </ul>
      //         </div>
      //       }
      //     </div>
      //     {this.props.owner && <button className="edit-but" onClick={this.handleshow}>
      //       <i className="fa fa-edit"></i>
      //     </button>}
      //     <Modal show={this.state.show} onHide={this.handleClose} centered>
      //       <Modal.Header closeButton>
      //         <Modal.Title>Edit info</Modal.Title>
      //       </Modal.Header>
      //       <Modal.Body>
      //         <form onSubmit={this.handleSubmit}>
      //           <div className="ui form">
      //             {this.props.user.role !== "Council" ?
      //               <div className="field">
      //                 <label>Name</label>
      //                 <div className="two fields">
      //                   <div className="field">
      //                     <input
      //                       required
      //                       type="text"
      //                       name="fname"
      //                       placeholder="First Name"
      //                       value={fname}
      //                       onChange={this.handleChange}
      //                     />
      //                   </div>
      //                   <div className="field">
      //                     <input
      //                       required
      //                       type="text"
      //                       name="lname"
      //                       placeholder="Last Name"
      //                       value={lname}
      //                       onChange={this.handleChange}
      //                     />
      //                   </div>
      //                 </div>
      //               </div>

      //               :
      //               <div className="field">
      //                 <label>Council Name</label>
      //                 <input
      //                   required
      //                   type="text"
      //                   name="fname"
      //                   placeholder="Name of your Council"
      //                   value={fname}
      //                   onChange={this.handleChange}
      //                 />
      //               </div>

      //             }
      //             <div className="field">
      //               <label>Bio</label>
      //               <textarea
      //                 maxlength="150"
      //                 rows="2"
      //                 required
      //                 placeholder="What do you want to talk about?"
      //                 name="bio"
      //                 value={bio}
      //                 onChange={this.handleChange}
      //               ></textarea>
      //             </div>
      //             <div className="field">
      //               <label>Facebook Handle</label>
      //               <div className="ui left icon input">
      //                 <input
      //                   name="facebook"
      //                   type="url"
      //                   onChange={this.handleChange}
      //                   value={facebook}
      //                   placeholder="Link of your Facebook Profile"
      //                 />
      //                 <i className="facebook icon"></i>
      //               </div>
      //             </div>
      //             <div className="field">
      //               <label>Twitter Handle</label>
      //               <div className="ui left icon input">
      //                 <input
      //                   name="twitter"
      //                   type="url"
      //                   onChange={this.handleChange}
      //                   value={twitter}
      //                   placeholder="Link of your Twitter Profile"
      //                 />
      //                 <i className="twitter icon"></i>
      //               </div>
      //             </div>
      //             <div className="field">
      //               <label>Linkedin Handle</label>
      //               <div className="ui left icon input">
      //                 <input
      //                   name="linkedin"
      //                   type="url"
      //                   onChange={this.handleChange}
      //                   value={linkedin}
      //                   placeholder="Link of your Linkedin Profile"
      //                 />
      //                 <i className="linkedin icon"></i>
      //               </div>
      //             </div>
      //             <div className="field">
      //               <label>Github Account</label>
      //               <div className="ui left icon input">
      //                 <input
      //                   name="github"
      //                   type="url"
      //                   onChange={this.handleChange}
      //                   value={github}
      //                   placeholder="Link of your Github Profile"
      //                 />
      //                 <i className="github icon"></i>
      //               </div>
      //             </div>
      //             <div className="submit confirmdiv">
      //               <button className="medium ui button confirm">
      //                 Confirm
      //               </button>
      //             </div>
      //           </div>
      //         </form>
      //       </Modal.Body>
      //     </Modal>

      //     {/* Resume LInk Modal */}
      //     <Modal show={this.state.show3} onHide={this.handleClose3} centered>
      //       <Modal.Header closeButton>
      //         <Modal.Title>Update Resume Link</Modal.Title>
      //       </Modal.Header>
      //       <Modal.Body>
      //         <form onSubmit={this.handleResume} className="ui form">
      //           <div className="field">
      //             <label>Resume Link (Upload your Resume in a Google Drive and paste the Public Link here)</label>

      //             <div className="ui left icon input">
      //               <input
      //                 name="resume"
      //                 required
      //                 onChange={this.handleChangeResume}
      //                 type="text"
      //                 value={this.state.resume}
      //               ></input>
      //               <i className="copy icon"></i>
      //             </div>

      //             <div style={{ textAlign: 'center', marginTop: '10px' }}>
      //               <button type="submit" className="ui button">Upload</button>
      //               <Link className="ui button" to="/resume">Create Resume</Link>
      //             </div>
      //           </div>

      //         </form>
      //       </Modal.Body>
      //     </Modal>

      //   </div>
      // </div>

      <div class="main-box">

        <input type='file' class='input-file' id="imgInp" />
        <button class='input-btn upload' id='input_btn'><i class="fa fa-camera cam"></i></button>
        <img class="cover" id="blah" src="https://images.ctfassets.net/7thvzrs93dvf/wpImage18643/2f45c72db7876d2f40623a8b09a88b17/linkedin-default-background-cover-photo-1.png?w=800&q=100" alt="" />
        <div class="dp-container"><img class="dp" src="https://media-exp1.licdn.com/dms/image/C4D03AQFZ8tyNfBItMQ/profile-displayphoto-shrink_800_800/0/1626335204827?e=1633564800&v=beta&t=GusvN2WI4B9dODjbbyIVv7SZaBUGV8cpRiKzp6GAxik" alt="userDP" />
          <button class='pen-btn upload'><i class="fa fa-pencil pen"></i></button>


          <div class="box">
            <div class="main-content">
              <h3>Selva Esakki Muthu.S</h3>
              <h4>Software Engineer @ Gadaget Solutions</h4>
              <div class="content">
                <h4>Thoothukudi, Tamil Nadu, India</h4>
                <ul class="content">
                  <li><span>97 connection</span></li>
                  <li><span>contact info</span></li>
                </ul>
              </div>
            </div>
            <div class="current">
              <ul>
                <li class="align"><img src="https://lh3.googleusercontent.com/WQuOogmAxhiYTCzHwxyJfq70_Fg5PIJ7zryuFM8dix-jG-6NwgOYtf2OZR6Qq8YSIAOe6g=s85" class="icon" alt="a" /><span class="cmpy clg">Gadaget Tech</span></li>
                <li class="align"><img src="https://lh3.googleusercontent.com/6ih0PuKeKquQ0poB6akePuTvfTRgOkmrSW6nSU24sehKODQoXWL6ek5d1VWzVADrkq9U=s59" class="icon" alt="b" /><span class="cmpy">Dr.Sivanthi Aditanar College Of Engineering</span></li>
              </ul>
            </div>
          </div>
          <button class="but">Open to <i class="fa fa-caret-down"></i></button>
          <button class="but1">Add Profile section <i class="fa fa-caret-down clr" ></i></button>
          <button class="but1">More...</button>
        </div>
      </div>

    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}

export default connect(mapStateToProps, { updatebasicinfo, updateUserPhoto, updateResumeLink })(Basic);

