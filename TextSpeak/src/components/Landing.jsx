import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      <h1>Welcome to TextSpeak!</h1>
      <h3>The premier hub for sharpening your speaking!</h3>
      <button>
        {" "}
        <Link to="/create-post">Get started</Link>
      </button>
    </div>
  );
}

export default Landing;
