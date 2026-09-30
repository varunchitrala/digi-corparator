import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Star } from 'lucide-react';

export const CitizenFeedbackModal = ({ isOpen, onClose, onSubmit, submitting }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Resolution Feedback & Rating">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Rate Your Satisfaction</label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1.5 rounded-lg transition-transform ${rating >= star ? 'text-amber-400 scale-110' : 'text-slate-300'}`}
              >
                <Star className="w-7 h-7 fill-current" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Feedback Comments</label>
          <textarea
            rows={3}
            placeholder="Tell us about the resolution quality..."
            className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={submitting}>Submit Feedback</Button>
        </div>
      </form>
    </Modal>
  );
};
