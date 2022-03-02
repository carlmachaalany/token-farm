import React from 'react'
import farmer from '../assets/farmer.png'

function Navbar(props: any) {

  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://github.com/carlmachaalany"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={farmer} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; DApp Token Farm
        </a>

        {/* <small id="account text-white">{props.account}</small> */}
        <ul className="navbar-nav px-3">
            <small className="text-secondary">
              <small id="account">{props.account}</small>
            </small>
        </ul>
      </nav>
  );
}

export default Navbar;
