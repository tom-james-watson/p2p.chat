import React from "react";
import { Shield, Users, Lock } from "react-feather";

export default (props) => {
  return (
    <div id="footer">
      <div className="container">
        <div className="row">
          <h5>Contact</h5>
          <p>
            For any help or feedback, please contact{" "}
            <a href="mailto:support@p2p.chat">support@p2p.chat</a>.
          </p>
          <p>
            For press, or any other queries, please get in touch at{" "}
            <a href="mailto:p2pchat@tomjwatson.com">p2pchat@tomjwatson.com</a>.
          </p>
        </div>
        <div className="row">
          <h5>About</h5>
          <p>
            p2p.chat is a free and open source project. Contributions or bug
            reports are extremely welcome at{" "}
            <a href="https://github.com/tom-james-watson/p2p.chat">
              https://github.com/tom-james-watson/p2p.chat
            </a>
            .
          </p>
        </div>
        <div className="row">
          <h5>Legal</h5>
          <p>
            <a href="/privacy-policy">Privacy Policy</a>
          </p>
          <p>
            <a href="/terms-and-conditions">Terms and Conditions</a>
          </p>
        </div>
        <div className="row">
          <p>
            Created by <a href="https://tomjwatson.com">tomjwatson.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
