import { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import './index.scss';

// FileUpload component
const FileUpload = ({ files, setFiles }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="form-group">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="dropzone"
      >
        <Upload />
        <p>Drop your files here or
          <label>
            <span> browse</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
        </p>
      </div>
      
      {files.length > 0 && (
        <ul className="file-list">
          {files.map((file, index) => (
            <li key={index}>
              <div className="file-info">
                <Upload />
                <span>{file.name}</span>
              </div>
              <button onClick={() => removeFile(index)}>
                <X />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// TopicForm component
const TopicForm = () => {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Topic name is required');
      return;
    }
    
    // Handle form submission here
    console.log({ topic, notes, files });
    
    // Clear form
    setTopic('');
    setNotes('');
    setFiles([]);
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="form-group">
        <label className="form-label">
          Topic
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="form-input"
          placeholder="Enter topic name"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="form-input"
          placeholder="Add your study notes here"
        />
      </div>

      <FileUpload files={files} setFiles={setFiles} />

      <button
        type="submit"
        className="btn-primary"
      >
        <Plus />
        <span>Add Entry</span>
      </button>
    </form>
  );
};

// Main App component
function App() {
  return (
    <div className="container">
      <h1>Study Tracker</h1>
      <div className="card">
        <TopicForm />
      </div>
    </div>
  );
}

export default App;
