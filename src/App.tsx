import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Instagram, 
  Youtube, 
  Music, 
  ShoppingBag, 
  Mail, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Sliders, 
  X, 
  BookOpen, 
  Sparkles, 
  SkipForward, 
  SkipBack, 
  Repeat, 
  Shuffle,
  Compass,
  FileText
} from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

// Visual Assets
const titledAlbumCover = new URL('./assets/images/american_heart_album_1781251430809.jpg', import.meta.url).href;

interface Track {
  title: string;
  duration: string;
  lengthSec: number;
  lyrics: string;
  story: string;
  chords: string[]; // Progression list of chord roots (e.g., G, C, D)
}

const trackDetails: Track[] = [
  {
    title: 'The American Way',
    duration: '3:19',
    lengthSec: 199,
    lyrics: `Dust on the steering wheel, sun in my eyes,
Singing the hymns of the prairie and skies.
The interstate highway, she stretches so far,
Guiding the path of this weathered guitar.
We work with our hands till the setting of sun,
And love who we have when the labor is done.
That is the heart, that is the day,
Living our lives in the American way.`,
    story: 'Written with a stubby pencil on a paper bag behind a highway diner in El Reno, OK. Recorded late-night in a single acoustic take inside the vintage barn. The microphone captured the actual hum of a passing distant freight train.',
    chords: ['G', 'C', 'G', 'D']
  },
  {
    title: 'Be Mine in the Springtime',
    duration: '4:00',
    lengthSec: 240,
    lyrics: `Winter was long, and the rivers were cold,
Deep in the valleys where secrets unfold.
But the dogwoods are blooming, the pastures are green,
The sweetest season that we've ever seen.
So dance with me, darlin', where wild roses cling,
Let the old fiddle play and the mockingbirds sing.
Warm wind is blowing, love's on the wing,
Be mine, sweet darlin', in the sweet springtime.`,
    story: 'A genuine country-gospel love letter to Bob\'s wife, composed in early May in the heart of the Cookson Hills. Features a delicate, high-register acoustic string-plucking style.',
    chords: ['C', 'F', 'C', 'G']
  },
  {
    title: 'Come On Home to Your Baby',
    duration: '3:48',
    lengthSec: 228,
    lyrics: `Tired of the headlights, tired of the wind,
Countin' the posts where the county lines bend.
The diesel is heavy, the city is loud,
Nothing but strangers lost deep in the crowd.
But the front porch is waiting, the lantern is bright,
Chasing away the cold Oklahoma night.
So pack up your troubles, let the road fade away,
Come on home to your baby, come on home to stay.`,
    story: 'Recorded inside the converted Tulsa barn during a heavy springtime storm. We opened the barn doors slightly to let the faint sound of falling rain blend directly into the acoustic tracks.',
    chords: ['Em', 'C', 'G', 'D']
  },
  {
    title: 'Aint Nobody Gonna Know',
    duration: '4:15',
    lengthSec: 255,
    lyrics: `Secrets we buried deep under the pine,
Tasted of copper, sweet water, and wine.
Down by the creek-bed where shadows grow long,
We sang the old melodies, simple and strong.
They can ask all they want, they can search till they're blue,
But they'll never find out what I whispered to you.
Cross your sweet heart, let the quiet river flow,
Aint nobody gonna look, aint nobody gonna know.`,
    story: 'Inspired by whispers of outlaw folklore and dry-county moonshine runners in the late 1960s along the Arkansas border. Uses a syncopated double-thumb acoustic bassline.',
    chords: ['Am', 'F', 'C', 'G']
  },
  {
    title: 'Broke Busted',
    duration: '3:38',
    lengthSec: 218,
    lyrics: `Well my pockets are empty, my boots are worn thin,
They turned me away at the county line inn.
The banker is calling, the tractor won't spark,
Just me and my thoughts walkin' home in the dark.
But they can't tax the sky, they can't buy up our pride,
We still got the horizon and the passion inside.
So let the rain fall, let the thunderheads roll,
I might be broke busted, but I'm rich in my soul!`,
    story: 'An energetic country-stomp written during a historically dry summer. Bob kept hitting his boot heels on the barn floorboards for percussion, which we kept in the finished track!',
    chords: ['G', 'G', 'D', 'C']
  },
  {
    title: 'Headed Home to Mama',
    duration: '2:53',
    lengthSec: 173,
    lyrics: `Grey gravel roads where the cedar trees grow,
Smell of pine woodfire in the valley below.
Granddaddy's tractor is parked by the wall,
Where the pecan leaves tumble in early-year fall.
I'm leaving the noise and the concrete behind,
Going back to the peace that is gentle and kind.
Where the tea is real sweet, and the biscuits are hot,
Back to Mama's old kitchen, my favorite spot.`,
    story: 'A quick-tempo fingerpicked tribute to traditional rural roots. Reflects the sudden comfort of home when life in the metropolitan fast lane gets a bit too heavy.',
    chords: ['C', 'G', 'Am', 'F']
  },
  {
    title: 'Traditional Country Music',
    duration: '4:11',
    lengthSec: 251,
    lyrics: `Give me that three-chord truth on a Saturday night,
A dusty old sawdust floor in the dim tavern light.
None of that digital drumbeat or processed machine,
Just old wooden instruments, vintage and clean.
Sing me of Hank, and of cash in the rain,
Sing me of heartache, redemption, and pain.
As long as the steel guitar cries in the dark,
Traditional country will live in our heart.`,
    story: 'Bob\'s absolute acoustic manifesto. Recorded live with no click track to allow the tempo to breathe naturally, just like a front-porch jam session.',
    chords: ['G', 'C', 'D', 'G']
  },
  {
    title: 'Genie in the Bottle',
    duration: '5:05',
    lengthSec: 305,
    lyrics: `Forty years of working in the zinc and the coal,
Left a heavy dark cough in the depths of my soul.
So I look at the glass sitting sweet on the bar,
Wishing for gold and a ride in a car.
But the genie inside only whispers of regret,
Of promises broken and suns that have set.
So I lay down my burden, put the cork back inside,
And trust in the Lord for my comfort and guide.`,
    story: 'A somber ballad detailing the struggles of blue-collar factory work in northeastern Oklahoma. The acoustic pattern uses a slow, ringing resonance with a drop-D tuning.',
    chords: ['Em', 'D', 'C', 'B7']
  },
  {
    title: 'Flowers on the Side of the Road',
    duration: '3:27',
    lengthSec: 207,
    lyrics: `Scattered white daisies in dusty clay ground,
Guarding the highway where semi-trucks bound.
A little wooden cross with a name painted red,
Honoring the words that a young cowboy said.
Life is a whisper, a spark in the wind,
A highway we travel with no map to send.
So cherish the miles and the hand that you hold,
Like those beautiful flowers on the side of the road.`,
    story: 'Written after Bob noticed a small roadside memorial during a long tour drive through the desolate panhandle of Texas. Composed entirely in major keys to celebrate life rather than mourn.',
    chords: ['G', 'D', 'Em', 'C']
  },
  {
    title: 'She Left Her Memories in My Brain',
    duration: '3:53',
    lengthSec: 233,
    lyrics: `Well she packed up her suitcase and headed out west,
Took her blue calico dresses, the ones I liked best.
She cleared out the cupboards, she swept up the floor,
Left her heavy brass key in the lock of the door.
But she forgot to take how she smiled in the rain,
And the perfume she wore like a sweet summer train.
She took all her boots and her silver-capped cane,
But she left all her beautiful memories in my brain.`,
    story: 'An upbeat, witty bluegrass-style country narrative about love lost and memory preserved. Recorded on Sunday morning with a vintage German tube microphone.',
    chords: ['G', 'C', 'D', 'G']
  },
  {
    title: 'The Man',
    duration: '4:12',
    lengthSec: 252,
    lyrics: `Granddaddy wore overalls, faded and blue,
He believed in hard work and a word that is true.
He built up the rafters of this little old barn,
Kept his cattle well fed and his family safe from harm.
Never made headlines, never had a big name,
But his honor was bright and untouched by the shame.
Now I look in the mirror and I hope I can stand,
With the courage and faith of that quiet old man.`,
    story: 'A deeply personal ode to Bob\'s late maternal grandfather, who constructed the actual Oklahoman hay-barn that is now Bob\'s beloved analogue home recording studio.',
    chords: ['D', 'A', 'Bm', 'G']
  },
  {
    title: 'Love That Cowgirl',
    duration: '3:03',
    lengthSec: 183,
    lyrics: `She can ride any stallion, she can rope any steer,
Got a wild western laugh that is ringing and clear.
A vintage Stetson hat is perched on her head,
And she lives by the rules that her grandmother said.
She doesn't care for diamonds or high-fashion schemes,
Just a saddle, a sunset, and honest green dreams.
So I play my guitar and I sing to the sky,
I'm gonna love that sweet cowgirl until the day I die!`,
    story: 'An energetic swing number that captures Bob\'s upbeat sense of humor, featuring a fast-tempo alternating-bass arrangement.',
    chords: ['A', 'D', 'E7', 'A']
  },
  {
    title: 'She Walked Away',
    duration: '4:15',
    lengthSec: 255,
    lyrics: `No dramatic goodbye, no tear on her cheek,
Just the sound of the wooden steps starting to creak.
The screen door let out a familiar soft whine,
And she stepped out across the long gravel path line.
I sat on the sofa, too proud to go plead,
Watching the wind blow the dandelion seed.
The sunset was red like the end of a play,
When she closed up the gate-latch and she walked away.`,
    story: 'The bittersweet closing track of the album. Composed around a highly expressive fingerstyle motif that mimics the slow, deliberate footsteps of someone leaving.',
    chords: ['Em', 'Am', 'D', 'G']
  }
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Advanced Stateful Audio Player States
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0); // in seconds
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [isVinylCrackle, setIsVinylCrackle] = useState(false);
  const [isBarnAmbiance, setIsBarnAmbiance] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [activeLyricTrack, setActiveLyricTrack] = useState<number | null>(null);

  // Web Audio refs for the Procedural Sound Synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  
  // Timers
  const playTickerRef = useRef<any>(null);
  const pluckSeqTimerRef = useRef<any>(null);
  const ambianceCrackleTimerRef = useRef<any>(null);

  const currentTrack = trackDetails[currentTrackIndex];

  // Map of Chord Root Note to Frequencies in Hz
  const chordNotesMap: Record<string, { bass: number; mid: number; high: number; ultra?: number }> = {
    'G':  { bass: 98.00,  mid: 196.00, high: 246.94, ultra: 293.66 }, // G3, G3, B3, D4
    'C':  { bass: 130.81, mid: 164.81, high: 196.00, ultra: 261.63 }, // C3, E3, G3, C4
    'D':  { bass: 146.83, mid: 220.00, high: 293.66, ultra: 369.99 }, // D3, A3, D4, F#4
    'Em': { bass: 82.41,  mid: 146.83, high: 196.00, ultra: 246.94 }, // E2, D3, G3, B3
    'Am': { bass: 110.00, mid: 164.81, high: 220.00, ultra: 261.63 }, // A2, E3, A3, C4
    'F':  { bass: 87.31,  mid: 174.61, high: 220.00, ultra: 261.63 }, // F2, F3, A3, C4
    'B7': { bass: 123.47, mid: 164.81, high: 246.94, ultra: 311.13 }, // B2, E3, B3, D#4
    'E7': { bass: 82.41,  mid: 164.81, high: 196.00, ultra: 293.66 }  // E2, E3, G3, D4
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync Master audio context volume
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.setValueAtTime(isMuted ? 0 : volume, 0);
    }
  }, [volume, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProceduralSynth();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Update Ticker + Track end logic when playing
  useEffect(() => {
    if (isPlaying) {
      // Start Web Audio Synthesizer Loop
      initAndStartAudio();

      playTickerRef.current = setInterval(() => {
        setPlayProgress((prev) => {
          if (prev >= currentTrack.lengthSec) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(playTickerRef.current);
      stopProceduralSynth();
    }

    return () => {
      clearInterval(playTickerRef.current);
      clearInterval(pluckSeqTimerRef.current);
      clearInterval(ambianceCrackleTimerRef.current);
    };
  }, [isPlaying, currentTrackIndex]);

  // Audio System Initialization
  const initAndStartAudio = async () => {
    try {
      if (!audioCtxRef.current) {
        // Create audio context
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
        
        // Setup warm gain stage
        const masterGain = audioCtxRef.current.createGain();
        masterGain.gain.setValueAtTime(isMuted ? 0 : volume, 0);
        masterGain.connect(audioCtxRef.current.destination);
        masterGainRef.current = masterGain;

        // Setup analogue warm lowpass filter to simulate wood and wire acoustic resonance
        const filter = audioCtxRef.current.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, 0); // cut down digital harshness
        filter.connect(masterGain);
        filterNodeRef.current = filter;
      }

      // Resume context if suspended (Browser autoplay guard)
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      // Start the dynamic fingerstyle arpeggiator engine (simulation of acoustic country strings)
      startFingerstyleArpeggiator();
    } catch (e) {
      console.warn("Web audio could not start or resume automatically:", e);
    }
  };

  const startFingerstyleArpeggiator = () => {
    if (!audioCtxRef.current || !filterNodeRef.current) return;
    const ctx = audioCtxRef.current;
    const filter = filterNodeRef.current;

    clearInterval(pluckSeqTimerRef.current);
    clearInterval(ambianceCrackleTimerRef.current);

    let tick = 0;
    const bpm = 112;
    const intervalMs = (60 / bpm) * 1000 * 0.75; // rhythmic tempo factor

    const chordsList = currentTrack.chords;

    // Standard country fingerpicking function
    const playStringPluck = (freq: number, velocity: number, decaySec = 0.9) => {
      try {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Use standard triangle for a lovely woody hollow ring, reminiscent of a guitar
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(velocity * (isMuted ? 0 : volume) * 0.45, ctx.currentTime + 0.012);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decaySec);

        osc.connect(noteGain);
        noteGain.connect(filter);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + decaySec + 0.1);
      } catch (e) {}
    };

    // Arpeggiator Timer Thread
    pluckSeqTimerRef.current = setInterval(() => {
      const currentChordIndex = Math.floor(tick / 4) % chordsList.length;
      const currentChordName = chordsList[currentChordIndex];
      const chordsObj = chordNotesMap[currentChordName] || chordNotesMap['G'];
      const subTick = tick % 4;

      // Fingerstyle Picking Pattern (Simulates real thumb-finger Travis picking)
      if (subTick === 0) {
        // Alternate thumb bass-note
        playStringPluck(chordsObj.bass, 1.0, 1.2);
      } else if (subTick === 1) {
        // High index string
        playStringPluck(chordsObj.high, 0.7, 0.7);
      } else if (subTick === 2) {
        // Mid thumb alternates
        playStringPluck(chordsObj.mid, 0.8, 0.9);
      } else if (subTick === 3) {
        // Ring finger pluck ultra-high
        playStringPluck(chordsObj.ultra || chordsObj.high * 1.5, 0.65, 0.6);
      }

      tick++;
    }, intervalMs);

    // Dynamic procedural rustling vinyl crackles and/or crickets and campfires
    ambianceCrackleTimerRef.current = setInterval(() => {
      if (isMuted) return;

      // Vinyl Dust Crackle Simulation (Pops/scratches randomly in real-time)
      if (isVinylCrackle && Math.random() < 0.28) {
        try {
          const popOsc = ctx.createOscillator();
          const popGain = ctx.createGain();
          const popFilter = ctx.createBiquadFilter();

          popOsc.type = 'sine';
          popOsc.frequency.setValueAtTime(4000 + Math.random() * 2000, ctx.currentTime);

          popFilter.type = 'bandpass';
          popFilter.frequency.setValueAtTime(6000, ctx.currentTime);

          popGain.gain.setValueAtTime(0, ctx.currentTime);
          popGain.gain.linearRampToValueAtTime(0.04 * (isMuted ? 0 : volume), ctx.currentTime + 0.002);
          popGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.012);

          popOsc.connect(popFilter);
          popFilter.connect(popGain);
          popGain.connect(ctx.destination);

          popOsc.start(ctx.currentTime);
          popOsc.stop(ctx.currentTime + 0.02);
        } catch (e) {}
      }

      // Cozy Barn Ambiance Soundscape (Wind hiss + crickets chirp simulation)
      if (isBarnAmbiance) {
        // 1. Crickets Chirp
        if (Math.random() < 0.15) {
          try {
            const time = ctx.currentTime;
            // Short burst of high-pitched chirps
            for (let i = 0; i < 3; i++) {
              const start = time + i * 0.08;
              const chirpOsc = ctx.createOscillator();
              const chirpGain = ctx.createGain();

              chirpOsc.type = 'sine';
              chirpOsc.frequency.setValueAtTime(3800 + Math.random() * 150, start);

              chirpGain.gain.setValueAtTime(0, start);
              chirpGain.gain.linearRampToValueAtTime(0.008 * (isMuted ? 0 : volume), start + 0.005);
              chirpGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.04);

              chirpOsc.connect(chirpGain);
              chirpGain.connect(ctx.destination);

              chirpOsc.start(start);
              chirpOsc.stop(start + 0.05);
            }
          } catch (e) {}
        }

        // 2. Continuous Wind/Firewood crackle hiss (simulated with low-amplitude random white noise oscillation)
        if (Math.random() < 0.4) {
          try {
            const windOsc = ctx.createOscillator();
            const windGain = ctx.createGain();
            const windFilter = ctx.createBiquadFilter();

            windOsc.type = 'triangle';
            windOsc.frequency.setValueAtTime(100 + Math.random() * 200, ctx.currentTime);

            windFilter.type = 'lowpass';
            windFilter.frequency.setValueAtTime(150, ctx.currentTime);

            windGain.gain.setValueAtTime(0, ctx.currentTime);
            windGain.gain.linearRampToValueAtTime(0.015 * (isMuted ? 0 : volume), ctx.currentTime + 0.05);
            windGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

            windOsc.connect(windFilter);
            windFilter.connect(windGain);
            windGain.connect(ctx.destination);

            windOsc.start(ctx.currentTime);
            windOsc.stop(ctx.currentTime + 0.35);
          } catch (e) {}
        }
      }

    }, 180);
  };

  const stopProceduralSynth = () => {
    clearInterval(pluckSeqTimerRef.current);
    clearInterval(ambianceCrackleTimerRef.current);
    pluckSeqTimerRef.current = null;
    ambianceCrackleTimerRef.current = null;
  };

  // Player Handlers
  const handleNextTrack = () => {
    setPlayProgress(0);
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * trackDetails.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % trackDetails.length);
    }
  };

  const handlePrevTrack = () => {
    setPlayProgress(0);
    setCurrentTrackIndex((prev) => (prev - 1 + trackDetails.length) % trackDetails.length);
  };

  const handleTrackSelect = (idx: number, playSound: boolean = false) => {
    setPlayProgress(0);
    setCurrentTrackIndex(idx);
    setIsPlaying(playSound);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentChordsLabel = currentTrack.chords.join(' → ');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-[#060b1c] text-[#fdfbf7] font-sans selection:bg-[#dfa659] selection:text-[#060b1c]">
      
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#060b1c]/95 backdrop-blur-xl py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <motion.a 
            href="#" 
            className="font-script text-4xl text-[#dfa659] hover:scale-105 transition-transform"
            whileHover={{ rotate: -2 }}
          >
            Bob Kelin
          </motion.a>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.3em] font-bold">
              <a href="#music" className="hover:text-[#dfa659] transition-colors relative group">
                MUSIC
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#dfa659] transition-all group-hover:w-full"></span>
              </a>
              <a href="#about" className="hover:text-[#dfa659] transition-colors relative group">
                STORY
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#dfa659] transition-all group-hover:w-full"></span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Solid Blue Theme Background */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#060b1c]">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0c1938] via-[#060b1c] to-[#040817]"></div>
        {/* Subtle premium ambient lighting */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#1e3a8a]/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#dfa659]/5 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#dfa659] mb-6 block font-bold">Oklahoma's Own</span>
            <h1 className="font-script text-8xl md:text-[12rem] text-[#dfa659] drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] leading-none mb-4">
              Bob Kelin
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="font-serif text-xl md:text-3xl italic text-[#fdfbf7]/90 max-w-2xl mx-auto mb-12 font-light tracking-wide lg:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          >
            "Faith, Strings, and the Open Road."
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <a href="#music" className="inline-flex items-center gap-2 bg-[#dfa659] text-[#060b1c] px-8 py-3.5 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#fdfbf7] transition-all">
              <span className="text-[10px] scale-110">▶</span> Album
            </a>
          </motion.div>
        </div>
      </section>

      {/* Interactive Music Hub containing Vinyl and custom audio player */}
      <section id="music" className="py-24 px-6 max-w-7xl mx-auto relative">
        <div className="mb-16">
          <h2 className="font-serif text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6">
            American Heart
          </h2>
          <p className="font-light text-md md:text-lg text-[#fdfbf7]/80 max-w-3xl leading-relaxed">
            Recorded in a single weekend in a converted barn outside of Tulsa, this album captures the raw, unfiltered essence of Oklahoma. No studio tricks—just wood, wire, and the truth.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 mt-12 items-start max-w-5xl mx-auto w-full">
          
          {/* Left Column: Official Album Cover */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 bg-stone-950 p-[1.5px] group"
            >
              <img 
                src={titledAlbumCover} 
                alt="American Heart Album Cover" 
                className="w-full h-full object-cover rounded-[1.9rem] transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none rounded-[1.9rem]"></div>
              
              <div className="absolute bottom-6 left-6 bg-[#dfa659] text-[#060b1c] px-4 py-2 rounded-xl font-bold text-[9px] uppercase tracking-[0.25em] shadow-xl">
                Stereo Analogue LP
              </div>
            </motion.div>
          </div>

          {/* Right Column: Stream Platforms Player Card */}
          <div className="lg:col-span-7 w-full">
            {/* Premium "LISTEN & STREAM" album card from Screenshot 2 */}
            <div className="w-full bg-[#0b1224] border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#dfa659]/5 blur-[50px] rounded-full pointer-events-none"></div>
            
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#dfa659] font-black block mb-2">
              LISTEN & STREAM
            </span>
            <h3 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">American Heart</h3>

            {/* Stream Rows */}
            <div className="space-y-4 mb-8">
              {/* Row 1: Spotify */}
              <div className="flex items-center justify-between p-4 bg-[#0d1527] border border-white/5 rounded-2xl transition-all hover:bg-[#0f1b35] group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1db954]/20 flex items-center justify-center text-[#1db954] shadow-inner">
                    <span className="text-xs font-bold">●</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-[#1db954]/80 font-black">OFFICIAL STREAM</span>
                    <span className="text-[13px] font-bold text-white/95">Stream on Spotify</span>
                  </div>
                </div>
                <a 
                  href="https://open.spotify.com/search/Bob%20Kelin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/10 hover:border-white/30 text-white rounded-full px-4 py-1.5 text-xs font-bold transition-colors"
                >
                  Listen &gt;
                </a>
              </div>

              {/* Row 2: Apple Music */}
              <div className="flex items-center justify-between p-4 bg-[#0d1527] border border-white/5 rounded-2xl transition-all hover:bg-[#0f1b35] group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#fc3c44]/20 flex items-center justify-center text-[#fc3c44] shadow-inner">
                    <span className="text-xs font-bold">▲</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-[#fc3c44]/80 font-black">NEW RELEASE</span>
                    <span className="text-[13px] font-bold text-white/95">Stream on Apple Music</span>
                  </div>
                </div>
                <a 
                  href="https://music.apple.com/search?term=Bob%20Kelin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/10 hover:border-white/30 text-white rounded-full px-4 py-1.5 text-xs font-bold transition-colors"
                >
                  Listen &gt;
                </a>
              </div>

              {/* Row 3: CD / Vinyl */}
              <div className="flex items-center justify-between p-4 bg-[#0d1527] border border-white/5 rounded-2xl transition-all hover:bg-[#0f1b35] group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#dfa659]/20 flex items-center justify-center text-[#dfa659] shadow-inner">
                    <span className="text-xs font-bold">◆</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-[#dfa659]/80 font-black">BUY CD / VINYL</span>
                    <span className="text-[13px] font-bold text-white/95">Order on Amazon</span>
                  </div>
                </div>
                <a 
                  href="https://music.amazon.com/search/Bob%20Kelin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/10 hover:border-white/30 text-white rounded-full px-4 py-1.5 text-xs font-bold transition-colors"
                >
                  Order &gt;
                </a>
              </div>
            </div>

            {/* Integrated Tracklist Divider */}
            <div className="border-t border-white/5 pt-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#dfa659] font-black flex items-center gap-2 mb-4">
                <span>♫</span> ALBUM TRACKLIST
              </span>

              <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {trackDetails.map((track, idx) => {
                  const isCurrent = idx === currentTrackIndex;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleTrackSelect(idx)}
                      className={`group/track flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer ${
                        isCurrent 
                          ? 'bg-[#0f1c3f] border border-[#dfa659]/30 shadow-lg text-white' 
                          : 'hover:bg-white/[0.03] text-[#fdfbf7]/80'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-2">
                        <span className={`text-[10px] font-mono select-none ${isCurrent ? 'text-[#dfa659] font-bold' : 'opacity-40'}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className={`text-xs tracking-wide truncate ${isCurrent ? 'text-[#dfa659] font-bold' : 'group-hover/track:text-white'}`}>
                          {track.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono opacity-40 group-hover/track:opacity-60">
                        {track.duration}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      </section>

      {/* Official Video Section */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl mb-4">Official Music Video</h2>
            <p className="text-[#dfa659] tracking-[0.4em] uppercase text-[10px] font-black">The American Way</p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-video bg-[#0f1c3f] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5 relative"
          >
            <iframe
              id="yt-music-video"
              className="w-full h-full"
              src="https://www.youtube.com/embed/16GD0wzBSP0?autoplay=0&rel=0&enablejsapi=1"
              title="Bob Kelin - The American Way"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: 0 }}
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* About Memoir Section */}
      <section id="about" className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="relative w-full aspect-square rounded-3xl p-8 bg-[#0b1224] border border-white/5 shadow-2xl overflow-hidden flex flex-col justify-between cursor-default select-none">
              {/* Background watermark/patterns for texture */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#dfa659_5%,transparent_50%)] opacity-10"></div>
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/[0.01] rounded-full border border-white/[0.05] pointer-events-none"></div>

              {/* Top Bar: Book label */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4 relative z-10 w-full">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-[#dfa659]" size={18} strokeWidth={1.5} />
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#dfa659] uppercase font-black font-semibold">
                    STUDIO DIARIES / VOL I
                  </span>
                </div>
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">OKLAHOMA • 1976</span>
              </div>

              {/* Center: Beautiful Acoustic Guitar Sketch & Typography Artwork */}
              <div className="my-auto py-8 relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#dfa659]/5 border border-[#dfa659]/10 flex items-center justify-center mb-6">
                  <Music className="text-[#dfa659]/70" size={28} strokeWidth={1} />
                </div>
                <h3 className="font-serif text-3xl font-normal text-white/95 tracking-wide mb-3">
                  Raw Wood & Wire
                </h3>
                <p className="text-xs text-[#fdfbf7]/60 max-w-sm leading-relaxed mb-6 font-light">
                  A journal recording the 48 hours of uninterrupted recording at the vintage barn outside Tulsa. Where the wood meets the warm crackle of dynamic vacuum tubes.
                </p>
                <div className="flex gap-4 text-[10px] font-mono text-[#dfa659]/80 uppercase tracking-widest bg-stone-900/40 px-4 py-2 rounded-xl border border-white/5">
                  <span>10 SONGS</span>
                  <span className="opacity-30">•</span>
                  <span>1 ACOUSTIC GUITAR</span>
                  <span className="opacity-30">•</span>
                  <span>0 EDITS</span>
                </div>
              </div>

              {/* Bottom: Signature / Authenticity note */}
              <div className="flex justify-between items-center pt-4 border-t border-white/15 relative z-10 w-full text-xs text-[#fdfbf7]/50 font-light">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dfa659]"></span>
                  <span> Tulsa Session Notes</span>
                </div>
                <span className="font-serif italic text-[#dfa659] text-sm">Est. 1976</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <Music className="text-[#dfa659] mb-8" size={48} strokeWidth={1} />
            <h2 className="font-serif text-5xl md:text-7xl mb-10 leading-tight">The Man Behind the Music</h2>
            <div className="space-y-6 text-lg text-[#fdfbf7]/70 leading-relaxed font-light">
              <p>
                Born in the red dirt of Oklahoma and raised on a steady diet of gospel hymns and outlaw country, Bob Kelin weaves tales of redemption, hard work, and the simple truths found in a worn-out Bible and a well-loved guitar.
              </p>
              <p>
                His music is a testament to the enduring spirit of the American West—where the dust settles on old boots, and every sunset over the barn feels like a promise from above.
              </p>
              <p>
                "I don't write songs for the radio," Bob says. "I write them for the people who still believe that a handshake means something and that a song can save your soul on a Sunday morning."
              </p>
            </div>
            <div className="mt-12 flex items-center gap-6">
              <div className="w-20 h-px bg-[#dfa659]/30"></div>
              <span className="font-script text-3xl text-[#dfa659]">Bob Kelin</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lyrics & Memoir Journal Overlay Sheet (Interactive modal) */}
      <AnimatePresence>
        {activeLyricTrack !== null && (
          <motion.div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[#f2ebd9] text-[#2c1d11] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-amber-900/10 flex flex-col max-h-[85vh] relative"
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
            >
              
              {/* Coffee stains / aged paper borders decorative */}
              <div className="absolute inset-0 bg-radial-gradient(ellipse_at_top,rgba(0,0,0,0.02)_0%,transparent_80%) pointer-events-none z-0"></div>

              {/* Header paper block */}
              <div className="border-b-2 border-dashed border-amber-900/15 p-6 md:p-8 flex justify-between items-start z-10 bg-[#ebe1cd] relative">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#d45d31] font-black block mb-1">Bob's Hand-written journal</span>
                  <h3 className="font-serif text-3xl font-black italic">{trackDetails[activeLyricTrack].title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[9px] bg-amber-950/10 border border-amber-950/15 font-mono px-2.5 py-0.5 rounded-full text-amber-950/80 font-black">
                      Est. BPM 112
                    </span>
                    <span className="text-[9px] bg-amber-950/10 border border-amber-950/15 font-mono px-2.5 py-0.5 rounded-full text-[#d45d31] font-black">
                      Prog: {trackDetails[activeLyricTrack].chords.join(' ')}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setActiveLyricTrack(null)}
                  className="p-2.5 rounded-full hover:bg-black/5 text-[#2c1d11]/50 hover:text-[#2c1d11] transition-colors"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Scrollable contents simulating notebook paper */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1 z-10 font-serif max-h-[50vh] scrollbar-thin scrollbar-thumb-amber-900/20 scrollbar-track-transparent">
                
                {/* Columns: Lyrics (Left) and Memoirs (Right) */}
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  
                  {/* Lyrics area */}
                  <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-amber-900/10 shadow-inner relative overflow-hidden">
                    {/* Horizontal writing lines simulation */}
                    <div className="absolute inset-0 bg-linear-gradient(rgba(139,94,60,0.06)_1px,transparent_1px) bg-[size:100%_28px] pointer-events-none opacity-85"></div>
                    
                    <h5 className="font-sans text-[10px] uppercase font-black tracking-widest text-[#d45d31] mb-4 relative z-10 pb-2 border-b border-amber-900/10">Typewritten sheet</h5>
                    <p className="text-sm md:text-base leading-[28px] italic font-medium text-amber-950/90 whitespace-pre-wrap relative z-10 font-serif">
                      {trackDetails[activeLyricTrack].lyrics}
                    </p>
                  </div>

                  {/* Memoirs area */}
                  <div className="space-y-4">
                    <h5 className="font-sans text-[10px] uppercase font-black tracking-widest text-[#d45d31] pb-2 border-b border-amber-900/10">The Tulsa memoir</h5>
                    <p className="text-sm text-[#2c1d11]/85 leading-relaxed font-sans font-light">
                      {trackDetails[activeLyricTrack].story}
                    </p>
                    <div className="pt-6 border-t-2 border-dashed border-amber-900/10">
                      <span className="text-[10px] uppercase font-black tracking-widest text-[#2c1d11]/35 block mb-2 font-sans">Instrument usage</span>
                      <p className="text-xs text-[#2c1d11]/70 leading-relaxed font-sans font-light italic">
                        Played with Bob's vintage 1957 Martin acoustic. No backing electric tracks. Straight wood and wire.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Footer play key */}
              <div className="border-t border-amber-900/10 p-5 bg-[#ebe1cd] flex items-center justify-between z-10">
                <span className="text-[10px] uppercase tracking-widest text-amber-950/50 font-sans font-bold">Bob Kelin Studio Book</span>
                <button
                  onClick={() => {
                    handleTrackSelect(activeLyricTrack, true);
                    setActiveLyricTrack(null);
                  }}
                  className="bg-[#d45d31] hover:bg-amber-950 hover:text-[#fdfbf7] text-white px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-md"
                >
                  Listen to this track NOW
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Newsletter Section */}
      <section className="py-32 bg-[#060b1c] text-[#fdfbf7] relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#c2272d]/5 via-transparent to-[#dfa659]/5 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Mail className="mx-auto mb-8 text-[#dfa659]" size={48} strokeWidth={1.2} />
          <h2 className="font-serif text-5xl mb-6 tracking-tight">Join the Inner Circle</h2>
          <p className="text-lg mb-12 font-light text-[#fdfbf7]/70 max-w-2xl mx-auto leading-relaxed">
            Get exclusive behind-the-scenes stories, early access to new music, and direct digital notes from Bob's home studio.
          </p>
          
          <AnimatePresence mode="wait">
            {!subscribed ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubscribe} 
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              >
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/[0.03] border border-white/10 text-[#fdfbf7] rounded-full px-8 py-4.5 placeholder:text-white/30 focus:outline-none focus:border-[#dfa659] focus:bg-white/[0.06] transition-all font-medium text-sm"
                />
                <button type="submit" className="bg-[#dfa659] text-[#060b1c] px-10 py-4.5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                  Subscribe
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#0f1c3f] border border-white/10 text-[#dfa659] p-8 rounded-3xl inline-block shadow-2xl"
              >
                <h4 className="font-bold text-xl mb-2">Welcome to the family!</h4>
                <p className="text-sm text-[#fdfbf7]/80 uppercase tracking-widest font-black">Check your inbox for a special gift.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 bg-[#030611] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-20">
            <div className="md:col-span-2">
              <h2 className="font-script text-6xl text-[#dfa659] mb-8">Bob Kelin</h2>
              <p className="text-[#fdfbf7]/40 max-w-sm leading-relaxed text-sm font-light">
                Bringing the spirit of Oklahoma to the world through song, faith, and the strings of a well-traveled guitar.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#dfa659] mb-8">Navigation</h4>
              <ul className="space-y-4 text-sm font-bold text-[#fdfbf7]/60 uppercase tracking-widest">
                <li><a href="#music" className="hover:text-[#dfa659] transition-colors">Music Hub</a></li>
                <li><a href="#about" className="hover:text-[#dfa659] transition-colors">Memoir</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#dfa659] mb-8">Listen</h4>
              <ul className="space-y-4 text-xs font-bold text-[#fdfbf7]/60 uppercase tracking-widest">
                <li>
                  <a href="https://open.spotify.com/search/Bob%20Kelin" target="_blank" rel="noopener noreferrer" className="hover:text-[#1db954] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1db954]"></span>
                    Spotify
                  </a>
                </li>
                <li>
                  <a href="https://music.apple.com/search?term=Bob%20Kelin" target="_blank" rel="noopener noreferrer" className="hover:text-[#fc3c44] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fc3c44]"></span>
                    Apple Music
                  </a>
                </li>
                <li>
                  <a href="https://music.amazon.com/search/Bob%20Kelin" target="_blank" rel="noopener noreferrer" className="hover:text-[#00a8e1] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a8e1]"></span>
                    Amazon Music
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#dfa659] mb-8">Follow</h4>
              <div className="flex flex-wrap gap-4">
                {[Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#dfa659] hover:text-[#060b1c] transition-all duration-300">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[#fdfbf7]/20 text-[10px] uppercase tracking-[0.3em] font-black">
              &copy; {new Date().getFullYear()} Bob Kelin Music. All rights reserved.
            </p>
            <div className="flex gap-10 text-[10px] uppercase tracking-[0.3em] font-black text-[#fdfbf7]/20">
              <a href="#" className="hover:text-[#dfa659] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#dfa659] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
