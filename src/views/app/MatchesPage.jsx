// src/views/app/MatchesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, CheckCircle2, XCircle, UserPlus, Clock } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { getMatches, respondToMatch, endMatch, findPotentialMatches } from '../../services/matching.service';
import { getUserPreferences, getUserProfile } from '../../services/user.service';

const StatusBadge = ({ status, isIncoming }) => {
  if (status === 'active') return (
    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ background: 'rgba(58,138,90,0.15)', color: '#5ABF8A', border: '1px solid rgba(58,138,90,0.25)' }}>
      ● Aktif
    </span>
  );
  if (status === 'pending' && isIncoming) return (
    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ background: 'rgba(232,160,32,0.15)', color: 'var(--amber)', border: '1px solid rgba(232,160,32,0.25)' }}>
      ⏳ Bekliyor
    </span>
  );
  if (status === 'pending') return (
    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ background: 'rgba(138,154,170,0.15)', color: 'var(--mist)', border: '1px solid rgba(138,154,170,0.2)' }}>
      Gönderildi
    </span>
  );
  return null;
};

const MatchCard = ({ match, currentUserId, onAccept, onReject, onEnd }) => {
  const otherUserId = match.users?.find(id => id !== currentUserId);
  const isIncoming = match.initiatedBy !== currentUserId && match.status === 'pending';

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
            style={{ background: 'rgba(232,160,32,0.15)', color: 'var(--amber)' }}>
            {otherUserId?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-body font-medium text-cream">
              {match.otherUserName || 'Kullanıcı'}
            </p>
            <p className="text-xs" style={{ color: 'var(--mist)' }}>
              {match.commonSubjects?.join(', ') || 'Ortak ders bilgisi yok'}
            </p>
          </div>
        </div>
        <StatusBadge status={match.status} isIncoming={isIncoming} />
      </div>

      {match.compatibilityScore > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(245,237,216,0.1)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${match.compatibilityScore}%`, background: 'var(--amber)' }} />
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--amber)' }}>
            %{match.compatibilityScore} uyum
          </span>
        </div>
      )}

      <div className="flex gap-2">
        {isIncoming && (
          <>
            <button onClick={() => onAccept(match.id)}
              className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-1.5">
              <CheckCircle2 size={14} /> Kabul Et
            </button>
            <button onClick={() => onReject(match.id)}
              className="flex-1 btn-outline py-2 text-sm flex items-center justify-center gap-1.5">
              <XCircle size={14} /> Reddet
            </button>
          </>
        )}
        {match.status === 'active' && (
          <button onClick={() => onEnd(match.id)}
            className="flex-1 btn-outline py-2 text-sm text-center"
            style={{ borderColor: 'rgba(200,64,64,0.3)', color: '#E87070' }}>
            Eşleşmeyi Sonlandır
          </button>
        )}
      </div>
    </div>
  );
};

const MatchesPage = () => {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [potentials, setPotentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active'); // active | incoming | find

  const fetchMatches = async () => {
    try {
      const m = await getMatches(currentUser.uid);
      setMatches(m);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPotentials = async () => {
    try {
      const prefs = await getUserPreferences(currentUser.uid);
      const subjects = prefs?.subjects || [];
      const campus = prefs?.campus || '';
      const results = await findPotentialMatches(currentUser.uid, subjects, campus);
      setPotentials(results.slice(0, 10));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (currentUser) fetchMatches();
  }, [currentUser]);

  useEffect(() => {
    if (tab === 'find' && currentUser) fetchPotentials();
  }, [tab]);

  const handleAccept = async (matchId) => {
    await respondToMatch(matchId, true);
    fetchMatches();
  };
  const handleReject = async (matchId) => {
    await respondToMatch(matchId, false);
    fetchMatches();
  };
  const handleEnd = async (matchId) => {
    await endMatch(matchId);
    fetchMatches();
  };

  const activeMatches = matches.filter(m => m.status === 'active');
  const incomingMatches = matches.filter(m => m.status === 'pending' && m.initiatedBy !== currentUser?.uid);
  const sentMatches = matches.filter(m => m.status === 'pending' && m.initiatedBy === currentUser?.uid);

  const tabs = [
    { id: 'active', label: 'Aktif', count: activeMatches.length },
    { id: 'incoming', label: 'Gelen İstekler', count: incomingMatches.length },
    { id: 'find', label: 'Eşleşme Bul', count: null },
  ];

  return (
    <AppLayout title="Eşleşmeler">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-xl text-sm font-body font-medium transition-all flex items-center gap-2"
            style={{
              background: tab === t.id ? 'rgba(232,160,32,0.12)' : 'rgba(245,237,216,0.04)',
              color: tab === t.id ? 'var(--amber)' : 'var(--mist)',
              border: tab === t.id ? '1px solid rgba(232,160,32,0.25)' : '1px solid rgba(245,237,216,0.08)',
            }}>
            {t.label}
            {t.count !== null && t.count > 0 && (
              <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ background: 'var(--amber)', color: 'var(--ink)' }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 rounded-full animate-spin"
            style={{ borderColor: 'rgba(245,237,216,0.15)', borderTopColor: 'var(--amber)' }} />
        </div>
      ) : (
        <>
          {/* Active matches */}
          {tab === 'active' && (
            <div>
              {activeMatches.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="font-display text-xl font-semibold text-cream mb-2">Aktif eşleşme yok</h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--mist)' }}>
                    Sana uygun çalışma arkadaşı bulmak için eşleşme ara.
                  </p>
                  <button onClick={() => setTab('find')} className="btn-primary px-6 py-2.5 text-sm">
                    Eşleşme Bul
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeMatches.map(m => (
                    <MatchCard key={m.id} match={m} currentUserId={currentUser?.uid}
                      onAccept={handleAccept} onReject={handleReject} onEnd={handleEnd} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Incoming requests */}
          {tab === 'incoming' && (
            <div>
              {incomingMatches.length === 0 && sentMatches.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <div className="text-4xl mb-4">📭</div>
                  <h3 className="font-display text-xl font-semibold text-cream mb-2">Bekleyen istek yok</h3>
                  <p className="text-sm" style={{ color: 'var(--mist)' }}>
                    Sana gelen eşleşme istekleri burada görünecek.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {incomingMatches.length > 0 && (
                    <div>
                      <h3 className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: 'var(--amber)' }}>
                        Gelen İstekler ({incomingMatches.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {incomingMatches.map(m => (
                          <MatchCard key={m.id} match={m} currentUserId={currentUser?.uid}
                            onAccept={handleAccept} onReject={handleReject} onEnd={handleEnd} />
                        ))}
                      </div>
                    </div>
                  )}
                  {sentMatches.length > 0 && (
                    <div>
                      <h3 className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: 'var(--mist)' }}>
                        Gönderilen İstekler ({sentMatches.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sentMatches.map(m => (
                          <MatchCard key={m.id} match={m} currentUserId={currentUser?.uid}
                            onAccept={handleAccept} onReject={handleReject} onEnd={handleEnd} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Find matches */}
          {tab === 'find' && (
            <div>
              {potentials.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="font-display text-xl font-semibold text-cream mb-2">Eşleşme bulunamadı</h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--mist)' }}>
                    Henüz ortak dersleri olan başka kullanıcı yok.<br />
                    Platform büyüdükçe eşleşmeler çıkacak.
                  </p>
                  <Link to="/onboarding" className="btn-outline px-6 py-2.5 text-sm">
                    Tercihlerini Güncelle
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {potentials.map((user, i) => (
                    <div key={i} className="glass-card p-5 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{ background: 'rgba(232,160,32,0.15)', color: 'var(--amber)' }}>
                          {user.displayName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-cream">{user.displayName || 'Kullanıcı'}</p>
                          <p className="text-xs" style={{ color: 'var(--mist)' }}>
                            Ortak: {user.commonSubjects?.join(', ')}
                          </p>
                        </div>
                        <span className="ml-auto text-xs font-mono font-bold" style={{ color: 'var(--amber)' }}>
                          %{user.compatibilityScore}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'rgba(245,237,216,0.1)' }}>
                        <div className="h-full rounded-full" style={{ width: `${user.compatibilityScore}%`, background: 'var(--amber)' }} />
                      </div>
                      <button className="btn-primary w-full py-2 text-sm flex items-center justify-center gap-2">
                        <UserPlus size={14} /> Eşleşme İsteği Gönder
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
};

export default MatchesPage;
