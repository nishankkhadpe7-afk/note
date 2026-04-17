import { useEffect, useState } from "react";

const API = "https://athletic-smile-production.up.railway.app";

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API}/notes`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  // Add note
  const addNote = async () => {
    if (!text.trim()) return;

    setLoading(true);

    try {
      await fetch(`${API}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text }),
      });

      setText("");
      fetchNotes();
    } catch (err) {
      console.error("Error adding note:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-3xl font-bold text-center">Notes App</h1>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a note..."
            className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
          />
          <button
            onClick={addNote}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
          >
            {loading ? "..." : "Add"}
          </button>
        </div>

        {/* Notes List */}
        <div className="space-y-2">
          {notes.length === 0 ? (
            <p className="text-gray-400 text-center">No notes yet</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-800 p-3 rounded border border-gray-700"
              >
                {note.content}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;