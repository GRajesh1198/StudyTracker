import { useState, useEffect } from 'react';
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
  const [entries, setEntries] = useState(() => {
    // Load entries from localStorage on initial render
    const savedEntries = localStorage.getItem('studyEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studyEntries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Topic name is required');
      return;
    }
    
    // Create new entry
    const newEntry = {
      id: Date.now(),
      topic,
      notes,
      files: files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      })),
      date: new Date().toISOString()
    };
    
    // Add to entries
    setEntries([newEntry, ...entries]);
    
    // Clear form
    setTopic('');
    setNotes('');
    setFiles([]);
    setError('');
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  return (
    <div>
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

      {entries.length > 0 && (
        <div className="entries-list">
          <h2>Study Entries</h2>
          {entries.map(entry => (
            <div key={entry.id} className="entry-card">
              <div className="entry-header">
                <h3>{entry.topic}</h3>
                <button 
                  onClick={() => deleteEntry(entry.id)}
                  className="delete-btn"
                >
                  <X />
                </button>
              </div>
              {entry.notes && (
                <p className="entry-notes">{entry.notes}</p>
              )}
              {entry.files.length > 0 && (
                <div className="entry-files">
                  <p className="files-heading">Attached Files:</p>
                  <ul>
                    {entry.files.map((file, index) => (
                      <li key={index}>
                        <Upload className="file-icon" />
                        <span>{file.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="entry-date">
                {new Date(entry.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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
