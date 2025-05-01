// src/components/CommentSection.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedTimestamp, setSelectedTimestamp] = useState(null);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:user_id (username),
        corrections (*)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error) {
      setComments(data);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    const { data: userData } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userData.user.id,
        content: newComment,
        timestamp_seconds: selectedTimestamp ? parseFloat(selectedTimestamp) : null
      });

    if (!error) {
      setNewComment('');
      setSelectedTimestamp(null);
      loadComments();
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      
      <form onSubmit={handleAddComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Add a comment..."
          required
        />
        <input
          type="number"
          step="0.1"
          placeholder="Timestamp (seconds)"
          value={selectedTimestamp || ''}
          onChange={(e) => setSelectedTimestamp(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Comment
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border p-4 rounded">
            <div className="flex justify-between mb-2">
              <span className="font-bold">{comment.user.username}</span>
              {comment.timestamp_seconds && (
                <span className="text-gray-500">
                  at {comment.timestamp_seconds}s
                </span>
              )}
            </div>
            <p>{comment.content}</p>
            
            {comment.corrections && comment.corrections.map((correction) => (
              <div key={correction.id} className="mt-2 bg-gray-100 p-2 rounded">
                <p>
                  <span className="font-bold">{correction.word}</span>: 
                  {correction.correct_pronunciation}
                </p>
                {correction.audio_url && (
                  <audio src={correction.audio_url} controls className="mt-1" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;