import { useUploadVideo } from "../hooks/video";

export default function UploadForm() {
  const mutation = useUploadVideo();
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    mutation.mutate(form);
  };
  return (
    <form onSubmit={onSubmit}>
      <input name="title" placeholder="Title" required />
      <textarea name="description" placeholder="Description" required />
      <input type="file" name="videoFile" accept="video/*" required />
      <input type="file" name="thumbnail" accept="image/*" required />
      <button type="submit">Upload</button>
    </form>
  );
}
