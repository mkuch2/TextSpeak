import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Welcome to TextSpeak!</h1>
      <h3 className="text-xl text-gray-600 mb-8">The premier hub for sharpening your speaking!</h3>
      <Link 
        to="/create-post"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Get started
      </Link>
    </div>
  );
}

export default Landing;
