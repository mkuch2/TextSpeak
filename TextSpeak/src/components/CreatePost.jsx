import { Link } from "react-router-dom";
import { useState } from "react";

function CreatePost() {
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
  }
  return (
    <div class="rounded-box">
      <h1>Create post</h1>
      <form onSubmit={handleSubmit}>
      <label>Title:
      <input 
        type="text" 
        name="postTitle" 
        value={inputs.postTitle || ""} 
        onChange={handleChange}
      />
      </label>
      <label>Enter your age:
        <input 
          type="number" 
          name="age" 
          value={inputs.age || ""} 
          onChange={handleChange}
        />
        </label>
        <input type="submit" />
    </form>
      
      <button>
        <Link to="/"> return </Link>
      </button>
    </div>
  );
}

export default CreatePost;
