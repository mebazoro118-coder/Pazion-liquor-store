import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, Trash2, Search, Filter } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export const AdminReviewsTab: React.FC = () => {
  const { reviews, updateReviewStatus, deleteReview } = useStore();
  const { userProfile } = useAuth();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = reviews.filter((r) => {
    const patronName = r.customerName || r.userName || '';
    const beverageName = r.productName || '';
    const matchesSearch =
      patronName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beverageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());

    const isApp = Boolean(r.isApproved || r.status === 'approved');
    let matchesStatus = true;
    if (filterStatus === 'pending') matchesStatus = !isApp;
    else if (filterStatus === 'approved') matchesStatus = isApp;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (id: string, approve: boolean) => {
    await updateReviewStatus(id, approve ? 'approved' : 'hidden', userProfile?.email);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Permanently remove this tasting review?')) {
      await deleteReview(id, userProfile?.email);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Tasting Notes & Patron Reviews Moderation
          </h2>
          <p className="text-xs text-stone-500">
            Audit customer cellar ratings and verify genuine bottle tasting reviews
          </p>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded font-semibold transition ${
              filterStatus === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 rounded font-semibold transition ${
              filterStatus === 'pending' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            Pending ({reviews.filter((r) => !(r.isApproved || r.status === 'approved')).length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1 rounded font-semibold transition ${
              filterStatus === 'approved' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            Approved ({reviews.filter((r) => Boolean(r.isApproved || r.status === 'approved')).length})
          </button>
        </div>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.length === 0 ? (
          <div className="col-span-2 bg-white border border-stone-200 rounded-lg p-10 text-center text-stone-400 text-xs">
            No tasting reviews found matching the current criteria.
          </div>
        ) : (
          filteredReviews.map((r) => {
            const isApproved = Boolean(r.isApproved || r.status === 'approved');
            const patronName = r.customerName || r.userName || 'Verified Patron';
            const beverageName = r.productName || 'Fine Beverage Selection';

            return (
              <div
                key={r.id}
                className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col justify-between hover:border-stone-300 transition text-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-stone-900">{patronName}</h3>
                      <p className="text-[11px] text-stone-500 font-medium">{beverageName}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isApproved ? 'Approved' : 'Pending Moderation'}
                    </span>
                  </div>

                <div className="flex items-center gap-1 text-amber-500 my-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-bold text-stone-700 ml-1">
                    {r.rating}.0 / 5.0
                  </span>
                </div>

                <p className="text-stone-700 leading-relaxed italic bg-stone-50 p-2.5 rounded border border-stone-100 my-2">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-stone-400 text-[10px]">
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>

                <div className="flex items-center gap-1 text-xs">
                  {!isApproved ? (
                    <button
                      onClick={() => handleApprove(r.id, true)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" /> Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(r.id, false)}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-medium flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" /> Unpublish
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
};
