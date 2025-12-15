import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const API_URL = 'http://localhost:8000';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${API_URL}/tasks`);
            if (response.ok) setTasks(await response.json());
        } catch (error) { console.error('Error fetching tasks:', error); }
        finally { setLoading(false); }
    };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const isZenMode = totalTasks > 0 && progress === 100;

    useEffect(() => {
        setShowConfetti(isZenMode);
    }, [isZenMode]);

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTaskTitle }),
            });
            if (response.ok) {
                setTasks([...tasks, await response.json()]);
                setNewTaskTitle('');
            }
        } catch (error) { console.error('Error adding task:', error); }
    };

    const toggleTask = async (taskId) => {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}/toggle`, { method: 'PATCH' });
            if (response.ok) setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
        } catch (error) { console.error('Error toggling task:', error); }
    };

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE' });
            if (response.ok) setTasks(tasks.filter((t) => t.id !== taskId));
        } catch (error) { console.error('Error deleting task:', error); }
    };

    const getQuote = () => {
        if (totalTasks === 0) return "ADD SOMETHING.";
        if (progress === 0) return "START NOW.";
        if (progress < 50) return "KEEP GRINDING.";
        if (progress === 50) return "HALFWAY.";
        if (progress < 100) return "ALMOST THERE.";
        return "ZEN MODE UNLOCKED.";
    };

    return (
        <div className="min-h-screen bg-[#FFE6F2] text-black font-mono flex items-center justify-center p-4 relative overflow-hidden">
            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={true} numberOfPieces={200} colors={['#000000', '#FF6B6B', '#4ECDC4', '#FFE66D', '#FF00FF']} />}

            <div className="w-full max-w-lg relative">
                {/* Shadow Block */}
                <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 rounded-none z-0"></div>

                <div className="relative z-10 bg-[#FFDEE9] border-4 border-black p-0 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0)]">

                    {/* Header */}
                    <div className="bg-[#4ECDC4] p-6 border-b-4 border-black">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-4xl font-black uppercase tracking-tighter italic">TASK_BOARD</h1>
                            <div className="bg-black text-white px-3 py-1 font-bold text-xl rotate-3">
                                {progress}%
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative w-full h-8 border-4 border-black bg-white mb-2">
                            <div
                                className="h-full bg-[#FFE66D] border-r-4 border-black transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            >
                                {/* Stripe pattern overlay */}
                                <div className="w-full h-full opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}></div>
                            </div>
                        </div>
                        <p className="font-bold text-sm tracking-widest uppercase text-right">{getQuote()}</p>
                    </div>

                    {/* Input */}
                    <div className="p-6 bg-[#fff0f5]">
                        <form onSubmit={addTask} className="flex gap-3">
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="ENTER TASK..."
                                className="flex-1 bg-white border-4 border-black p-3 font-bold placeholder-black/30 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase"
                            />
                            <button
                                type="submit"
                                disabled={!newTaskTitle.trim()}
                                className="bg-[#FF6B6B] text-black border-4 border-black p-3 hover:translate-y-1 hover:translate-x-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:translate-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={28} strokeWidth={3} />
                            </button>
                        </form>
                    </div>

                    {/* Task List */}
                    <div className="p-6 pt-0 bg-[#fff0f5] h-[400px] overflow-y-auto scrollbar-hide">
                        {loading ? (
                            <div className="text-center font-bold text-2xl animate-pulse">LOADING...</div>
                        ) : tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                                <X size={64} strokeWidth={4} />
                                <p className="font-bold text-xl">NO TASKS FOUND</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {tasks.map((task) => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            className={`group flex items-center p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all ${task.completed ? 'bg-[#e0e0e0] opacity-80' : 'bg-white'
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleTask(task.id)}
                                                className={`flex-shrink-0 w-8 h-8 border-4 border-black mr-4 flex items-center justify-center transition-all ${task.completed
                                                        ? 'bg-black text-[#FFE66D]'
                                                        : 'bg-white hover:bg-[#FFE66D] text-transparent'
                                                    }`}
                                            >
                                                <Check size={20} strokeWidth={4} />
                                            </button>

                                            <span
                                                className={`flex-grow font-bold text-lg uppercase truncate ${task.completed ? 'line-through decoration-4 decoration-black' : ''
                                                    }`}
                                            >
                                                {task.title}
                                            </span>

                                            <button
                                                onClick={() => deleteTask(task.id)}
                                                className="ml-2 w-10 h-10 flex items-center justify-center bg-[#FF9F1C] border-2 border-black hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <Trash2 size={20} strokeWidth={3} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="absolute top-4 left-4 font-black text-xs -rotate-2 bg-white border-2 border-black p-1">
                Task Board
            </div>
        </div>
    );
}

export default App;
