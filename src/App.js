import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { saveVoteToFirebase } from './firebase';
import './index.css';

// Przykładowe dane - TUTAJ WPISZ SWOJE KLIPY I KATEGORIE
const CATEGORIES = [
  {
    id: 1,
    name: "Teraz Rodzina",
    description: "Wybierz klipa na którym panuje rodzinna atmosfera",
    clips: [
      { id: 1, title: "Clip #1", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Wszyscy razem grają i dobrze się bawią" },
      { id: 2, title: "Clip #2", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Moment gdzie wszyscy się wspierają" },
      { id: 3, title: "Clip #3", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: 4, title: "Clip #4", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Wspólne śmianie się z głupoty" },
      { id: 5, title: "Clip #5", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Moment wsparcia po porażce" },
      { id: 6, title: "Clip #6", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: 7, title: "Clip #7", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Wszyscy w voice chacie gadają o życiu" },
      { id: 8, title: "Clip #8", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Rodzinny obiad w grze" },
    ]
  },
  {
    id: 2,
    name: "Najlepszy Clutch",
    description: "Wybierz najbardziej epicką akcję clutchową",
    clips: [
      { id: 1, title: "Clutch #1", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "1v5 i wygrana" },
      { id: 2, title: "Clutch #2", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Ostatnia sekunda defuse" },
      { id: 3, title: "Clutch #3", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Ace w ostatniej rundzie" },
      { id: 4, title: "Clutch #4", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Niesamowity comeback" },
      { id: 5, title: "Clutch #5", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Perfect timing" },
      { id: 6, title: "Clutch #6", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Clutch z nożem" },
      { id: 7, title: "Clutch #7", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Blind shot do wygranej" },
      { id: 8, title: "Clutch #8", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "1HP clutch" },
    ]
  },
  {
    id: 3,
    name: "Najbardziej Fail",
    description: "Wybierz największą wtopę/faila",
    clips: [
      { id: 1, title: "Fail #1", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Team kill w najgorszym momencie" },
      { id: 2, title: "Fail #2", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Spadnięcie z mapy" },
      { id: 3, title: "Fail #3", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Miss z AWP z 2 metrów" },
      { id: 4, title: "Fail #4", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Zabicie się granatem" },
      { id: 5, title: "Fail #5", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Wbiegniecie w molotov" },
      { id: 6, title: "Fail #6", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Pomyłka gracza z wrogiem" },
      { id: 7, title: "Fail #7", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Epic disconnect w ważnym momencie" },
      { id: 8, title: "Fail #8", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", context: "Przypadkowy drop broni wrogowi" },
    ]
  },
];

// Generowanie unikalnego ID głosu
const generateVoteId = () => {
  return 'VOTE-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Storage helper - localStorage jako backup
const saveVote = (voteId, data) => {
  localStorage.setItem(`vote:${voteId}`, JSON.stringify(data));
  return { key: `vote:${voteId}`, value: JSON.stringify(data) };
};

const saveProgress = (progress) => {
  localStorage.setItem('voting_progress', JSON.stringify(progress));
};

const loadProgress = () => {
  const saved = localStorage.getItem('voting_progress');
  return saved ? JSON.parse(saved) : null;
};

const clearProgress = () => {
  localStorage.removeItem('voting_progress');
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('intro');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [selectedClips, setSelectedClips] = useState({ tier1: null, tier2: null, tier3: null });
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [voteId, setVoteId] = useState(null);
  const [showContext, setShowContext] = useState({});

  const currentCategory = CATEGORIES[currentCategoryIndex];
  const hasVotedInCategory = selectedClips.tier1 || selectedClips.tier2 || selectedClips.tier3;

  // Wczytaj progress przy starcie
  useEffect(() => {
    const progress = loadProgress();
    if (progress && progress.currentScreen === 'voting') {
      const confirmResume = window.confirm(
        'Znaleziono zapisany postęp głosowania. Chcesz kontynuować od miejsca gdzie skończyłeś?'
      );
      if (confirmResume) {
        setCurrentScreen(progress.currentScreen);
        setCurrentCategoryIndex(progress.currentCategoryIndex);
        setVotes(progress.votes);
      } else {
        clearProgress();
      }
    }
  }, []);

  // Zapisuj progress przy każdej zmianie
  useEffect(() => {
    if (currentScreen === 'voting') {
      saveProgress({
        currentScreen,
        currentCategoryIndex,
        votes
      });
    }
  }, [currentScreen, currentCategoryIndex, votes]);

  // Funkcja głosowania - MUSI BYĆ ASYNC!
  const handleVote = async () => {
    if (!hasVotedInCategory) return;

    const categoryVote = {
      categoryId: currentCategory.id,
      categoryName: currentCategory.name,
      tier1: selectedClips.tier1,
      tier2: selectedClips.tier2,
      tier3: selectedClips.tier3,
    };

    const newVotes = { ...votes, [currentCategory.id]: categoryVote };
    setVotes(newVotes);

    if (currentCategoryIndex < CATEGORIES.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setSelectedClips({ tier1: null, tier2: null, tier3: null });
      setShowContext({});
    } else {
      // Koniec głosowania - zapisz do Firebase
      const id = generateVoteId();
      try {
        // Zapisz do Firebase
        await saveVoteToFirebase(id, newVotes);
        // Zapisz też lokalnie jako backup
        saveVote(id, newVotes);
        setVoteId(id);
        setCurrentScreen('summary');
        clearProgress();
      } catch (error) {
        console.error('Błąd zapisu:', error);
        alert('Błąd podczas zapisywania głosu. Spróbuj ponownie.');
      }
    }
  };

  // Funkcja skip z potwierdzeniem - MUSI BYĆ ASYNC!
  const handleSkip = async () => {
    if (hasVotedInCategory) return;
    
    if (!showSkipConfirm) {
      setShowSkipConfirm(true);
      return;
    }

    const categoryVote = {
      categoryId: currentCategory.id,
      categoryName: currentCategory.name,
      skipped: true
    };

    const newVotes = { ...votes, [currentCategory.id]: categoryVote };
    setVotes(newVotes);

    if (currentCategoryIndex < CATEGORIES.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setSelectedClips({ tier1: null, tier2: null, tier3: null });
      setShowSkipConfirm(false);
      setShowContext({});
    } else {
      const id = generateVoteId();
      try {
        // Zapisz do Firebase
        await saveVoteToFirebase(id, newVotes);
        // Zapisz też lokalnie jako backup
        saveVote(id, newVotes);
        setVoteId(id);
        setCurrentScreen('summary');
        clearProgress();
      } catch (error) {
        console.error('Błąd zapisu:', error);
        alert('Błąd podczas zapisywania głosu. Spróbuj ponownie.');
      }
    }
  };

  // Wybór clipu do tiera
  const selectClip = (clipId, tier) => {
    const currentTierClip = selectedClips[tier];
    
    if (currentTierClip === clipId) {
      setSelectedClips({ ...selectedClips, [tier]: null });
      return;
    }

    const otherTiers = Object.keys(selectedClips).filter(t => t !== tier);
    let newSelected = { ...selectedClips };
    
    for (let otherTier of otherTiers) {
      if (selectedClips[otherTier] === clipId) {
        newSelected[otherTier] = currentTierClip;
        break;
      }
    }
    
    newSelected[tier] = clipId;
    setSelectedClips(newSelected);
  };

  const getClipTier = (clipId) => {
    if (selectedClips.tier1 === clipId) return 'tier1';
    if (selectedClips.tier2 === clipId) return 'tier2';
    if (selectedClips.tier3 === clipId) return 'tier3';
    return null;
  };

  // INTRO SCREEN
  if (currentScreen === 'intro') {
    return (
      <div className="intro-screen">
        <div className="intro-container">
          <h1 className="intro-title">
            🏆 Kartonowe Heroki 2025 🏆
          </h1>
          <p className="intro-subtitle">
            Głosowanie na najlepsze klipy z naszego serwera!
          </p>
          
          <div className="video-container">
            <iframe 
              className="video-iframe"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Tutorial"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="info-box">
            <h2 className="info-title">📋 Jak głosować?</h2>
            <ul className="info-list">
              <li>• Zobaczysz {CATEGORIES.length} kategorii, każda z 8 klipami</li>
              <li>• Możesz zagłosować na TOP 3 klipy (🥇 🥈 🥉)</li>
              <li>• Kliknij na klip, a potem wybierz tier (1, 2 lub 3)</li>
              <li>• Możesz pominąć kategorię przyciskiem SKIP</li>
              <li>• Na końcu dostaniesz unikalny kod - wyślij go na priv!</li>
            </ul>
          </div>

          <button onClick={() => setCurrentScreen('voting')} className="start-button">
            Zacznij Głosowanie! 🚀
          </button>
        </div>
      </div>
    );
  }

  // SUMMARY SCREEN
  if (currentScreen === 'summary') {
    return (
      <div className="summary-screen">
        <div className="summary-container">
          <h1 className="summary-title">
            ✅ Dziękujemy za głosowanie!
          </h1>
          
          <div className="code-box">
            <p className="code-label">
              Twój unikalny kod głosowania:
            </p>
            <div className="code-display">
              <p className="code-text">
                {voteId}
              </p>
            </div>
            <p className="code-instruction">
              Skopiuj ten kod i wyślij go na priv do jednego z organizatorów!
            </p>
          </div>

          <div className="votes-summary">
            <h3 className="votes-title">📊 Twoje głosy:</h3>
            <div className="votes-list">
              {Object.values(votes).map((vote, idx) => (
                <div key={idx} className="vote-item">
                  <span className="vote-category">{vote.categoryName}:</span>{' '}
                  {vote.skipped ? '(pominięte)' : `${vote.tier1 ? '✓' : ''}${vote.tier2 ? '✓' : ''}${vote.tier3 ? '✓' : ''} zagłosowano`}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(voteId);
              alert('Kod skopiowany do schowka!');
            }}
            className="copy-button"
          >
            📋 Skopiuj Kod
          </button>
        </div>
      </div>
    );
  }

  // VOTING SCREEN
  return (
    <div className="voting-screen">
      <div className="voting-container">
        {/* Progress bar */}
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ width: `${((currentCategoryIndex + 1) / CATEGORIES.length) * 100}%` }}
          ></div>
        </div>

        {/* Header */}
        <div className="voting-header">
          <div className="header-info">
            <span className="category-counter">
              Kategoria {currentCategoryIndex + 1} z {CATEGORIES.length}
            </span>
          </div>
          <h1 className="category-name">{currentCategory.name}</h1>
          <p className="category-description">{currentCategory.description}</p>
        </div>

        {/* Clips grid - 4 w rzędzie */}
        <div className="clips-grid">
          {currentCategory.clips.map((clip) => {
            const tier = getClipTier(clip.id);
            
            return (
              <div key={clip.id} className={`clip-card tier-${tier || 'none'}`}>
                {/* Video */}
                <div className="clip-video">
                  <iframe
                    className="clip-iframe"
                    src={clip.videoUrl}
                    title={clip.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Title and context button */}
                <div className="clip-header">
                  <span className="clip-title">{clip.title}</span>
                  {clip.context && (
                    <button
                      onMouseEnter={() => setShowContext({ ...showContext, [clip.id]: true })}
                      onMouseLeave={() => setShowContext({ ...showContext, [clip.id]: false })}
                      className="context-button"
                    >
                      <AlertCircle size={20} />
                      {showContext[clip.id] && (
                        <div className="context-tooltip">
                          {clip.context}
                        </div>
                      )}
                    </button>
                  )}
                </div>

                {/* Tier selection buttons */}
                <div className="tier-buttons">
                  <button
                    onClick={() => selectClip(clip.id, 'tier1')}
                    className={`tier-button tier1-button ${tier === 'tier1' ? 'active' : ''}`}
                  >
                    🥇 1
                  </button>
                  <button
                    onClick={() => selectClip(clip.id, 'tier2')}
                    className={`tier-button tier2-button ${tier === 'tier2' ? 'active' : ''}`}
                  >
                    🥈 2
                  </button>
                  <button
                    onClick={() => selectClip(clip.id, 'tier3')}
                    className={`tier-button tier3-button ${tier === 'tier3' ? 'active' : ''}`}
                  >
                    🥉 3
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="action-buttons">
          <button
            onClick={handleSkip}
            disabled={hasVotedInCategory}
            className={`action-button skip-button ${hasVotedInCategory ? 'disabled' : ''} ${showSkipConfirm ? 'confirm' : ''}`}
          >
            {showSkipConfirm ? '⚠️ Potwierdź SKIP' : 'SKIP ⏭️'}
          </button>
          
          <button
            onClick={handleVote}
            disabled={!hasVotedInCategory}
            className={`action-button vote-button ${!hasVotedInCategory ? 'disabled' : ''}`}
          >
            ZAGŁOSUJ ✅
          </button>
        </div>

        {/* Info text */}
        {!hasVotedInCategory && (
          <p className="info-text">
            Wybierz przynajmniej 1 klip aby odblokować przycisk ZAGŁOSUJ
          </p>
        )}
        {showSkipConfirm && (
          <p className="info-text warning">
            Kliknij ponownie SKIP aby potwierdzić pominięcie tej kategorii
          </p>
        )}
      </div>
    </div>
  );
}

export default App;