// src/components/CreatePost.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AudioRecorder from "./AudioRecorder";

function CreatePost() {
  const navigate = useNavigate();
  const [audioBlob, setAudioBlob] = useState(null);
  const [inputs, setInputs] = useState({
    title: "",
    language: "French",
    level: "Beginner",
    text: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs(values => ({...values, [name]: value}));
  };

  const handleRecordingComplete = (blob) => {
    setAudioBlob(blob);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Check authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('You must be logged in to create a post');
      }

      if (!audioBlob) {
        alert("Please record audio before submitting");
        return;
      }

      // 1. Upload audio file to Supabase Storage
      const fileName = `${Date.now()}-recording.webm`;
      const { data: audioData, error: audioError } = await supabase.storage
        .from('recordings')
        .upload(fileName, audioBlob);

      if (audioError) {
        console.error('Storage error:', audioError);
        throw audioError;
      }

      // 2. Create post record in database
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          title: inputs.title,
          language: inputs.language,
          level: inputs.level,
          text_content: inputs.text,
          audio_url: audioData.path,
          user_id: user.id
        })
        .select()
        .single();

      if (postError) {
        console.error('Database error:', postError);
        throw postError;
      }

      // 3. Navigate to the new post
      navigate(`/post/${postData.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.message || "Failed to create post. Please try again.");
    }
  };

  return (
    <div>
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