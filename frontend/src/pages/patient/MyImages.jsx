// My Images page
// What it needs from backend:
//   GET    /api/images         → fetch all images for logged-in patient
//   POST   /api/images/upload  → upload new image (multipart/form-data)
//   DELETE /api/images/:id     → delete an image

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const VIEW_TYPES = ['front', 'left', 'right', 'top', 'bottom', 'other'];

const MyImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form state for new upload
  const [file, setFile] = useState(null);
  const [viewType, setViewType] = useState('front');
  const [notes, setNotes] = useState('');
  const [preview, setPreview] = useState(null); // Image preview before upload

  // Fetch images on page load
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await api.get('/images');
      setImages(res.data.images || []);
    } catch {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  // Show preview when file selected
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image');

    // Use FormData because we're sending a file (multipart/form-data)
    // NOT JSON — this is different from other API calls
    const formData = new FormData();
    formData.append('image', file);        // 'image' must match upload.single('image') in backend
    formData.append('viewType', viewType);
    formData.append('notes', notes);

    setUploading(true);
    try {
      const res = await api.post('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages([res.data.image, ...images]); // Add new image to top
      setFile(null);
      setPreview(null);
      setNotes('');
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.delete(`/images/${id}`);
      setImages(images.filter(img => img._id !== id));
      toast.success('Image deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <Loader text="Loading images..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">My Dental Images</h1>
      <p className="text-gray-400 mb-8">Upload and track your dental photos over time</p>

      {/* Upload Form */}
      <div className="card mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Upload New Image</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Select Image</label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="input-field file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer cursor-pointer"
              />
            </div>
            <div>
              <label className="form-label">View Type</label>
              <select value={viewType} onChange={e => setViewType(e.target.value)} className="input-field">
                {VIEW_TYPES.map(v => (
                  <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any notes about this image..."
              rows={2}
              className="input-field resize-none"
            />
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <p className="form-label">Preview</p>
              <img src={preview} alt="Preview" className="h-40 rounded-lg border border-[#2d3f6b] object-cover" />
            </div>
          )}

          <button type="submit" disabled={uploading} className="btn-primary">
            {uploading ? 'Uploading...' : '📤 Upload Image'}
          </button>
        </form>
      </div>

      {/* Images Gallery */}
      <h2 className="text-xl font-semibold text-white mb-4">
        My Gallery ({images.length} images)
      </h2>
      {images.length === 0 ? (
        <div className="card text-center text-gray-400 py-16">
          <p className="text-4xl mb-3">📸</p>
          <p>No images uploaded yet. Upload your first dental photo above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img._id} className="card p-0 overflow-hidden group">
              <img
                // Image is served from backend/uploads as a static file
                src={`http://localhost:5000${img.imageUrl}`}
                alt={img.viewType}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-blue-400 text-sm font-medium capitalize">{img.viewType} view</span>
                  <button onClick={() => handleDelete(img._id)}
                    className="text-red-400 hover:text-red-300 text-xs transition-colors">
                    Delete
                  </button>
                </div>
                {img.notes && <p className="text-gray-400 text-xs">{img.notes}</p>}
                <p className="text-gray-600 text-xs mt-1">{new Date(img.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MyImages;