import React from 'react'

const Footer = () => {
  return (
         
    <footer className="footer" style={{backgroundColor: "#1e1e27"}}>
    <div className="container footerContainer">
        <div className="row">
            <div className="col-lg-12">
            <div className="footer_nav_container">
                <div className="cr"></div>
            </div>
            </div>
              </div>
              <div className="top_nav">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="top_nav_right">
                            <ul className="top_nav_menu">
                                
                                <li className="language">
                                    <a href="/">
                                        United States
                                        {/* <i className="fa fa-angle-down"></i> */}
                                    </a>
                                    {/* <ul className="language_selection">
                                        <li><a href="/">French</a></li>
                                        <li><a href="/">Italian</a></li>
                                        <li><a href="/">German</a></li>
                                        <li><a href="/">Spanish</a></li>
                                    </ul> */}
                                </li>
                                <li className="currency">
                                    <a href="/">
                                        usd
                                        {/* <i className="fa fa-angle-down"></i> */}
                                    </a>
                                    {/* <ul className="currency_selection">
                                        <li><a href="/">cad</a></li>
                                        <li><a href="/">aud</a></li>
                                        <li><a href="/">eur</a></li>
                                        <li><a href="/">gbp</a></li>
                                    </ul> */}
                                </li>
                                <li className="account">
                                    <a href="/">
                                        My Account
                                        <i className="fa fa-angle-down"></i>
                                    </a>
                                    {/* <ul className="account_selection">
                                        <li><a href="/"><i className="fa fa-sign-in" aria-hidden="true"></i>Sign In</a></li>
                                        <li><a href=""><i className="fa fa-user-plus" aria-hidden="true"></i>Register</a></li>
                                    </ul> */}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-6 text-right">
                        <div className="top_nav_left">©2022 All Rights Reserverd. Made with <i className="fa fa-heart-o" aria-hidden="true"></i> by <a href="https://krishnasai.me/">Krishna Sai</a></div>
                    </div>
                </div>
            </div>
            </div>
              
    </div>
  </footer>
  )
}

export default Footer