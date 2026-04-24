import { Bookmark, Send } from 'lucide-react';

interface Props {
  onApply: () => void;
  onSave: () => void;
  isSaved?: boolean;
}

const MobileActionBar = ({ onApply, onSave, isSaved }: Props) => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0px_-10px_20px_rgba(32,27,15,0.08)] flex gap-3 z-50 border-t border-cream-200">
    <button
      onClick={onApply}
      className="bg-teal text-white font-bold px-6 py-3.5 rounded-xl flex-1 active:scale-95 transition-transform flex items-center justify-center gap-2"
    >
      <Send className="w-4 h-4" />
      Postular
    </button>
    <button
      onClick={onSave}
      className={`p-3.5 rounded-xl active:scale-95 transition-transform ${
        isSaved ? 'bg-coral-50 text-coral' : 'bg-cream-100 text-brown'
      }`}
    >
      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
    </button>
  </div>
);

export default MobileActionBar;