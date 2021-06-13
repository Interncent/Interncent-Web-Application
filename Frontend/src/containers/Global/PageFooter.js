import { React } from 'react';
import { Link } from 'react-router-dom'

const PageFooter = () => {
    return (
        <footer id="footer">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-6 col-sm-3 column">
                        <h4>Information</h4>
                        <ul className="list-unstyled">
                            <li><Link to="">Products</Link></li>
                            <li><Link to="">Services</Link></li>
                            <li><Link to="">Benefits</Link></li>
                            <li><Link to="">Developers</Link></li>
                        </ul>
                    </div>
                    <div className="col-xs-6 col-sm-3 column">
                        <h4>About</h4>
                        <ul className="list-unstyled">
                            <li><Link to="#">Contact Us</Link></li>
                            <li><Link to="#">Delivery Information</Link></li>
                            <li><Link to="#">Privacy Policy</Link></li>
                            <li><Link to="#">Terms &amp; Conditions</Link></li>
                        </ul>
                    </div>
                    <div className="col-xs-12 col-sm-3 column">
                        <h4>Stay Posted</h4>
                        <form>
                            <div className="form-group">
                                <input type="text" className="form-control" title="No spam, we promise!" placeholder="Tell us your email" />
                            </div>
                            <div className="form-group">
                                <button className="btn btn-default" type="button">Subscribe for updates</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-xs-12 col-sm-3 text-right">
                        <h4>Follow</h4>
                        <div className="list-inline">
                            <Link to=""><i className="icon-lg ion-social-twitter-outline"></i></Link>
                            <Link to=""><i className="icon-lg ion-social-facebook-outline"></i></Link>
                            <Link to=""><i className="icon-lg ion-social-instagram-outline"></i></Link>
                        </div>
                    </div>
                </div>
                <br />
                <div style={{ textAlign: 'center' }}>
                    <span className="pull-right text-muted small">
                        Developed By Vedant Nagani and Huzaifa Khilawala
                    </span>
                </div>
            </div>
        </footer>
    )
}
export default PageFooter;