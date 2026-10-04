import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ArrowDownUp, LogOut, MapPin, Search, Store as StoreIcon } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import { stores, storeRatings } from '../data/mockData';

function readSavedRatings() {
  try {
    return JSON.parse(localStorage.getItem('rateit-ratings') || '[]');
  } catch {
    return [];
  }
}

export default function UserStores() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [savedRatings, setSavedRatings] = useState(readSavedRatings);
  const [draftRatings, setDraftRatings] = useState({});
  const [notice, setNotice] = useState('');

  useEffect(() => {
    localStorage.setItem('rateit-ratings', JSON.stringify(savedRatings));
  }, [savedRatings]);

  const visibleStores = useMemo(() => {
    const mergedRatings = [
      ...storeRatings.filter((rating) => !savedRatings.some(
        (saved) => saved.storeId === rating.storeId && saved.userId === rating.userId
      )),
      ...savedRatings,
    ];
    const query = search.trim().toLowerCase();

    return stores
      .map((store) => {
        const ratingsForStore = mergedRatings.filter((rating) => rating.storeId === store.id);
        const average = ratingsForStore.length
          ? Number((ratingsForStore.reduce((sum, rating) => sum + rating.rating, 0) / ratingsForStore.length).toFixed(1))
          : store.rating;

        return {
          ...store,
          average,
          myRating: ratingsForStore.find((rating) => rating.userId === user?.id)?.rating ?? 0,
        };
      })
      .filter((store) => `${store.name} ${store.address}`.toLowerCase().includes(query))
      .sort((first, second) => sortBy === 'rating'
        ? second.average - first.average
        : first.name.localeCompare(second.name));
  }, [savedRatings, search, sortBy, user?.id]);

  const submitRating = (storeId) => {
    const ratingValue = Number(draftRatings[storeId]);
    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      setNotice('Select a star rating before saving.');
      return;
    }

    const nextRating = {
      id: `${user.id}-${storeId}`,
      storeId,
      userId: user.id,
      rating: ratingValue,
      date: new Date().toISOString(),
    };

    setSavedRatings((current) => [
      ...current.filter((rating) => !(rating.storeId === storeId && rating.userId === user.id)),
      nextRating,
    ]);
    setDraftRatings((current) => ({ ...current, [storeId]: ratingValue }));
    setNotice('Your rating has been saved.');
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-slate-950/45 px-4 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-300">
              <StoreIcon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">RateIt</div>
              <div className="text-sm text-slate-300">Store ratings</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-300 sm:block">{user?.name}</span>
            <button
              type="button"
              onClick={logout}
              aria-label="Log out"
              title="Log out"
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Discover</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Explore stores</h1>
            <p className="mt-2 text-sm text-slate-400">Find a place and share your rating.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-slate-900/55 px-3.5 py-2.5 text-slate-400 sm:min-w-64">
              <Search className="h-4 w-4 shrink-0" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search stores or locations"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/55 px-3.5 py-2.5 text-sm text-slate-300">
              <ArrowDownUp className="h-4 w-4" />
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="bg-transparent text-white outline-none">
                <option value="name">Name</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>
        </div>

        {notice && <p role="status" className="rounded-xl border border-teal-500/25 bg-teal-500/10 px-4 py-3 text-sm text-teal-100">{notice}</p>}

        {visibleStores.length === 0 ? (
          <GlassCard className="px-6 py-14 text-center">
            <Search className="mx-auto h-6 w-6 text-slate-500" />
            <p className="mt-3 font-medium text-white">No stores match your search</p>
            <p className="mt-1 text-sm text-slate-400">Try another store name or location.</p>
          </GlassCard>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleStores.map((store) => {
              const selectedRating = Number(draftRatings[store.id] ?? store.myRating);

              return (
                <GlassCard key={store.id} className="flex min-h-64 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
                        <StoreIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-white">{store.name}</h2>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400"><MapPin className="h-3.5 w-3.5 shrink-0" />{store.address}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-lg font-semibold text-white">{store.average.toFixed(1)}</div>
                      <div className="text-[11px] text-slate-500">overall</div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="mb-2 text-xs text-slate-400">Overall rating</p>
                      <StarRating value={Math.round(store.average)} size="sm" />
                    </div>
                    <div className="text-right">
                      <p className="mb-2 text-xs text-slate-400">Your rating</p>
                      {store.myRating ? <span className="text-sm font-medium text-teal-200">{store.myRating} / 5</span> : <span className="text-sm text-slate-500">Not rated</span>}
                    </div>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    <div>
                      <p className="mb-1.5 text-xs text-slate-400">Rate this store</p>
                      <StarRating value={selectedRating} interactive onChange={(value) => {
                        setNotice('');
                        setDraftRatings((current) => ({ ...current, [store.id]: value }));
                      }} />
                    </div>
                    <button
                      type="button"
                      onClick={() => submitRating(store.id)}
                      disabled={!selectedRating}
                      className="rounded-lg bg-gradient-to-r from-teal-400 to-violet-500 px-3.5 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {store.myRating ? 'Update' : 'Submit'}
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}