// src/pages/PostPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import CommentSection from '../components/CommentSection';

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        // Get the full audio URL
        if (data.audio_url) {
          const { data: audioData } = supabase.storage
            .from('recordings')
            .getPublicUrl(data.audio_url);
          data.audio_url = audioData.publicUrl;
        }
        
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p>{post.text_content}</p>
      </div>
      {post.audio_url && (
        <div className="mb-4">
          <audio controls src={post.audio_url} className="w-full" />
        </div>
      )}
      <CommentSection postId={id} />
    </div>
  );
}

export default PostPage;