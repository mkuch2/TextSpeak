import { supabase } from '../supabaseClient';

export async function createPost(title, language, textContent, audioFile) {
  try {
    const fileName = `${Date.now()}-recording.webm`;
    const { data: audioData, error: audioError } = await supabase.storage
      .from('recordings')
      .upload(fileName, audioFile);

    if (audioError) throw audioError;

    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title,
        language,
        text_content: textContent,
        audio_url: audioData.path,
        user_id: userData.user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function getPost(id) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      user:user_id (username)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:user_id (username),
      corrections (*)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}
