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
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Recording</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title:</label>
          <input 
            type="text" 
            name="title" 
            value={inputs.title} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Language:</label>
          <select
            name="language"
            value={inputs.language}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
            <option value="German">German</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Level:</label>
          <select
            name="level"
            value={inputs.level || 'Beginner'}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Text:</label>
          <textarea
            name="text"
            value={inputs.text}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Recording:</label>
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={!audioBlob}
        >
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;