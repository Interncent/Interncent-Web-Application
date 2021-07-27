import React, { Component } from 'react';

import { LinkedIn } from 'react-linkedin-login-oauth2';
// import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png'

class LinkedInPage extends Component {
  state = {
    code: '',
    errorMessage: '',
  };


  handleSuccess = (data) => {
    this.setState({
      code: data.code,
      errorMessage: '',
    });
  }

  handleFailure = (error) => {
    this.setState({
      code: '',
      errorMessage: error.errorMessage,
    });
  }
  
  render() {
    const { code, errorMessage } = this.state;
    return (
      <div>
        <LinkedIn
          clientId="78xa78en40e0ew"
          onFailure={this.handleFailure}
          onSuccess={this.handleSuccess}
          redirectUri="http://localhost:3000/linkedin"
          renderElement={({ onClick, disabled }) => (
            <button style={{color: "#020b53",backgroundColor: "#FFCA3D"}} onClick={onClick} disabled={disabled}>Custom linkedin element</button>
          )}
        >
          
        </LinkedIn>
        {!code && <div>No code</div>}
        {code && <div>Code: {code}</div>}
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    );
  }
}

export default LinkedInPage;