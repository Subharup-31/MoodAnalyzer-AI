// ========================================
// CONFIGURATION FILE
// Replace these with your actual API keys
// ========================================

export const CONFIG = {
    // Firebase Configuration
    // Get from: https://console.firebase.google.com/
    firebase: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "moodsync-75abf.firebaseapp.com",
        projectId: "moodsync-75abf",
        storageBucket: "moodsync-75abf.firebasestorage.app",
        messagingSenderId: "588431096579",
        appId: "1:588431096579:web:86893d41bb5e3f0a93c736"
    },

    // Hugging Face API Key
    // Get from: https://huggingface.co/settings/tokens
    huggingface: {
        apiKey: "YOUR_HUGGINGFACE_API_KEY",
        model: "finiteautomata/bertweet-base-sentiment-analysis"
    },

    // Google Gemini API Key
    // Get from: https://makersuite.google.com/app/apikey
    gemini: {
        apiKey: "YOUR_GEMINI_API_KEY",
        model: "gemini-2.0-flash"
    },

    // Spotify API Token (OAuth 2.0)
    // Will be loaded from server
    spotify: {
        token: null
    }
};

// ========================================
// MOOD CONFIGURATION
// ========================================

export const MOODS = {
    happy: {
        emoji: '😊',
        color: '#FFD93D',
        label: 'Happy',
        reply: "Love the positive energy! Keep shining ✨",
        gradient: 'linear-gradient(135deg, #FFD93D 0%, #FFA500 100%)',
        keywords: [
            'happy', 'happiness', 'joy', 'joyful', 'joyous', 'excited', 'exciting', 'excitement', 'great', 'wonderful', 'amazing', 'fantastic', 'excellent',
            'good day', 'best day', 'awesome', 'brilliant', 'cheerful', 'delighted', 'delightful', 'elated', 'euphoric',
            'glad', 'grateful', 'gratitude', 'thrilled', 'upbeat', 'positive', 'positivity', 'optimistic', 'blessed', 'lucky', 'fortunate',
            'love', 'loving', 'loved', 'adore', 'accomplished', 'achievement', 'achieved', 'successful', 'success', 'proud', 'confident', 'confidence',
            'smile', 'smiling', 'laughing', 'laugh', 'fun', 'enjoy', 'enjoying', 'enjoyed', 'pleasure', 'satisfied', 'satisfaction',
            'celebrate', 'celebrating', 'celebration', 'win', 'winning', 'victory', 'triumph', 'perfect', 'incredible', 'beautiful',
            'blessed', 'thankful', 'appreciate', 'appreciation', 'grateful', 'gratitude', 'content', 'contentment'
        ]
    },
    sad: {
        emoji: '😢',
        color: '#5DA3FA',
        label: 'Sad',
        reply: "It's okay to feel this way. Tomorrow is a new day 💙",
        gradient: 'linear-gradient(135deg, #5DA3FA 0%, #4A90E2 100%)',
        keywords: [
            'sad', 'sadness', 'unhappy', 'down', 'feeling down', 'depressed', 'depression', 'lonely', 'loneliness', 'disappointed', 'disappointment', 'hurt', 'hurting', 'heartbroken', 'heartbreak',
            'bad day', 'terrible day', 'worst day', 'awful', 'horrible', 'miserable', 'gloomy', 'melancholy', 'melancholic',
            'crying', 'cry', 'cried', 'tears', 'tearful', 'upset', 'devastated', 'broken', 'empty', 'emptiness', 'hopeless', 'hopelessness', 'despair',
            'grief', 'grieving', 'mourning', 'mourn', 'loss', 'lost', 'rejected', 'rejection', 'abandoned', 'abandonment', 'isolated', 'isolation', 'blue', 'low', 'down',
            'sorrow', 'sorrowful', 'painful', 'pain', 'ache', 'aching', 'suffering', 'suffer', 'struggle', 'struggling', 'difficult', 'hard time',
            'can\'t cope', 'giving up', 'worthless', 'useless', 'failure', 'failed', 'regret', 'regretting', 'miss', 'missing'
        ]
    },
    angry: {
        emoji: '😠',
        color: '#FF6B6B',
        label: 'Angry',
        reply: "Take a deep breath. Channel this energy positively 💪",
        gradient: 'linear-gradient(135deg, #FF6B6B 0%, #E74C3C 100%)',
        keywords: [
            'angry', 'anger', 'mad', 'madness', 'frustrated', 'frustration', 'frustrating', 'annoyed', 'annoying', 'irritated', 'irritating', 'irritation', 'furious', 'rage', 'raging', 'pissed', 'pissed off',
            'hate', 'hating', 'hatred', 'disgusted', 'disgusting', 'disgust', 'outraged', 'outrage', 'livid', 'seething', 'fuming', 'irate',
            'resentful', 'resentment', 'resent', 'bitter', 'bitterness', 'hostile', 'hostility', 'aggressive', 'aggression', 'violent', 'violence', 'explosive', 'fed up',
            'can\'t stand', 'sick of', 'tired of', 'infuriating', 'infuriated', 'maddening', 'enraging', 'enraged',
            'pissed', 'furious', 'livid', 'incensed', 'indignant', 'wrathful', 'wrath', 'boiling', 'steaming',
            'unfair', 'injustice', 'betrayed', 'betrayal', 'disrespected', 'disrespect', 'insulted', 'insult'
        ]
    },
    anxious: {
        emoji: '😰',
        color: '#9D84B7',
        label: 'Anxious',
        reply: "You've got this. One step at a time 🌸",
        gradient: 'linear-gradient(135deg, #9D84B7 0%, #8E44AD 100%)',
        keywords: [
            'anxious', 'anxiety', 'worried', 'worry', 'worrying', 'nervous', 'nervousness', 'stressed', 'stress', 'stressful', 'overwhelmed', 'overwhelming', 'panic', 'panicking', 'panicked', 'fear', 'fearful', 'scared', 'scary',
            'stress', 'stressed out', 'tension', 'tense', 'pressure', 'pressured', 'uneasy', 'unease', 'restless', 'agitated', 'troubled', 'troubling',
            'concerned', 'concern', 'apprehensive', 'frightened', 'terrified', 'paranoid', 'insecure', 'insecurity', 'uncertain', 'uncertainty',
            'doubt', 'doubtful', 'doubting', 'hesitant', 'hesitate', 'jittery', 'on edge', 'wound up', 'tense', 'frantic', 'frantically',
            'racing thoughts', 'can\'t breathe', 'heart racing', 'shaking', 'trembling', 'sweating', 'nauseous', 'dizzy',
            'what if', 'worried about', 'scared of', 'afraid', 'frightened', 'dread', 'dreading', 'nightmare', 'can\'t sleep', 'insomnia'
        ]
    },
    calm: {
        emoji: '😌',
        color: '#90EE90',
        label: 'Calm',
        reply: "Beautiful peace. Savor this moment 🍃",
        gradient: 'linear-gradient(135deg, #90EE90 0%, #2ECC71 100%)',
        keywords: [
            'calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content', 'zen', 'balanced',
            'centered', 'composed', 'quiet', 'still', 'gentle', 'soothing', 'restful', 'mellow',
            'meditative', 'mindful', 'present', 'grounded', 'stable', 'steady', 'harmonious',
            'at peace', 'inner peace', 'serenity', 'stillness', 'silence', 'breathe', 'breathing'
        ]
    },
    bored: {
        emoji: '😐',
        color: '#94A3B8',
        label: 'Bored',
        reply: "Time for something new! What sparks your curiosity? 🤔",
        gradient: 'linear-gradient(135deg, #94A3B8 0%, #64748b 100%)',
        keywords: [
            'bored', 'boring', 'dull', 'uninterested', 'monotonous', 'tedious', 'bland', 'plain',
            'nothing to do', 'same old', 'routine', 'repetitive', 'uninspiring', 'lifeless',
            'stagnant', 'stuck', 'restless', 'listless', 'apathetic', 'indifferent', 'numb',
            'empty', 'void', 'meaningless', 'pointless', 'going through motions', 'autopilot'
        ]
    },
    excited: {
        emoji: '🤩',
        color: '#FF69B4',
        label: 'Excited',
        reply: "Your enthusiasm is contagious! Ride this wave of excitement! 🚀",
        gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
        keywords: [
            'excited', 'thrilled', 'pumped', 'hyped', 'energetic', 'enthusiastic', 'eager',
            'can\'t wait', 'looking forward', 'anticipating', 'buzzing', 'electric', 'fired up',
            'stoked', 'amped', 'psyched', 'exhilarated', 'animated', 'vibrant', 'dynamic',
            'passionate', 'motivated', 'inspired', 'charged', 'ready', 'adventure', 'new opportunity'
        ]
    },
    grateful: {
        emoji: '🙏',
        color: '#DDA0DD',
        label: 'Grateful',
        reply: "Gratitude is a beautiful mindset. Your appreciation lights up the world! ✨",
        gradient: 'linear-gradient(135deg, #DDA0DD 0%, #9370DB 100%)',
        keywords: [
            'grateful', 'thankful', 'blessed', 'appreciate', 'appreciation', 'fortunate', 'lucky',
            'thank you', 'thanks', 'blessing', 'gift', 'privilege', 'honor', 'humbled',
            'count my blessings', 'grateful for', 'thankful for', 'appreciate having', 'value',
            'cherish', 'treasure', 'recognize', 'acknowledge', 'indebted', 'gracious'
        ]
    },
    confused: {
        emoji: '😕',
        color: '#FFA07A',
        label: 'Confused',
        reply: "It's okay to feel uncertain. Clarity will come with time and reflection 🤔",
        gradient: 'linear-gradient(135deg, #FFA07A 0%, #FF7F50 100%)',
        keywords: [
            'confused', 'puzzled', 'bewildered', 'perplexed', 'lost', 'uncertain', 'unclear',
            'don\'t understand', 'mixed up', 'baffled', 'mystified', 'stumped', 'conflicted',
            'torn', 'undecided', 'unsure', 'questioning', 'wondering', 'second guessing',
            'doubt', 'dilemma', 'crossroads', 'complicated', 'complex', 'overwhelming choices'
        ]
    },
    proud: {
        emoji: '😤',
        color: '#32CD32',
        label: 'Proud',
        reply: "You should be proud! Your achievements deserve recognition 🏆",
        gradient: 'linear-gradient(135deg, #32CD32 0%, #228B22 100%)',
        keywords: [
            'proud', 'accomplished', 'achieved', 'success', 'successful', 'victory', 'won',
            'completed', 'finished', 'done', 'milestone', 'breakthrough', 'progress', 'improved',
            'overcame', 'conquered', 'mastered', 'excelled', 'outstanding', 'exceeded',
            'personal best', 'goal reached', 'dream come true', 'hard work paid off', 'earned'
        ]
    },
    lonely: {
        emoji: '😔',
        color: '#708090',
        label: 'Lonely',
        reply: "You're not alone, even when it feels that way. Connection is always possible 💜",
        gradient: 'linear-gradient(135deg, #708090 0%, #2F4F4F 100%)',
        keywords: [
            'lonely', 'alone', 'isolated', 'solitary', 'disconnected', 'abandoned', 'forgotten',
            'no one understands', 'by myself', 'single', 'solo', 'friendless', 'outcast',
            'excluded', 'left out', 'missing someone', 'need company', 'craving connection',
            'social isolation', 'withdrawn', 'distant', 'empty house', 'silence', 'nobody'
        ]
    },
    hopeful: {
        emoji: '🌅',
        color: '#FFB347',
        label: 'Hopeful',
        reply: "Hope is a powerful force. Keep believing in better days ahead! 🌈",
        gradient: 'linear-gradient(135deg, #FFB347 0%, #FF8C00 100%)',
        keywords: [
            'hopeful', 'optimistic', 'positive', 'looking up', 'better days', 'light at the end',
            'things will improve', 'getting better', 'recovery', 'healing', 'progress', 'forward',
            'future', 'tomorrow', 'possibility', 'potential', 'opportunity', 'chance', 'maybe',
            'perhaps', 'could be', 'might', 'hoping', 'wishing', 'dreaming', 'believing'
        ]
    },
    overwhelmed: {
        emoji: '😵',
        color: '#CD853F',
        label: 'Overwhelmed',
        reply: "Take it one step at a time. You don't have to carry it all at once 🤗",
        gradient: 'linear-gradient(135deg, #CD853F 0%, #A0522D 100%)',
        keywords: [
            'overwhelmed', 'too much', 'can\'t handle', 'drowning', 'swamped', 'buried',
            'overloaded', 'stressed out', 'breaking point', 'at capacity', 'maxed out',
            'juggling too much', 'plate is full', 'stretched thin', 'burning out', 'exhausted',
            'pressure', 'weight of the world', 'suffocating', 'crushing', 'intense', 'heavy'
        ]
    },
    content: {
        emoji: '😊',
        color: '#98FB98',
        label: 'Content',
        reply: "Contentment is a gift. You've found peace in the present moment 🕊️",
        gradient: 'linear-gradient(135deg, #98FB98 0%, #90EE90 100%)',
        keywords: [
            'content', 'satisfied', 'at peace', 'comfortable', 'settled', 'fulfilled', 'complete',
            'enough', 'sufficient', 'good enough', 'okay with', 'accepting', 'balanced',
            'stable', 'steady', 'even', 'moderate', 'reasonable', 'fair', 'adequate',
            'pleasant', 'nice', 'fine', 'alright', 'decent', 'satisfactory', 'wholesome'
        ]
    },
    tired: {
        emoji: '😴',
        color: '#B0C4DE',
        label: 'Tired',
        reply: "Rest is productive too. Listen to what your body needs 💤",
        gradient: 'linear-gradient(135deg, #B0C4DE 0%, #778899 100%)',
        keywords: [
            'tired', 'exhausted', 'fatigue', 'fatigued', 'sleepy', 'drowsy', 'weary', 'worn out',
            'drained', 'depleted', 'burned out', 'burnout', 'low energy', 'no energy', 'sluggish',
            'need sleep', 'need rest', 'can\'t keep eyes open', 'yawning', 'lethargic',
            'run down', 'wiped out', 'beat', 'spent', 'knackered', 'pooped', 'zonked'
        ]
    },
    motivated: {
        emoji: '💪',
        color: '#FF6347',
        label: 'Motivated',
        reply: "That drive is powerful! Channel this energy into your goals! 🔥",
        gradient: 'linear-gradient(135deg, #FF6347 0%, #DC143C 100%)',
        keywords: [
            'motivated', 'motivation', 'driven', 'determined', 'focused', 'ambitious', 'goal-oriented',
            'inspired', 'energized', 'pumped up', 'ready to go', 'let\'s do this', 'fired up',
            'productive', 'productive day', 'getting things done', 'on a roll', 'momentum',
            'push forward', 'make it happen', 'take action', 'hustle', 'grind', 'work hard'
        ]
    },
    inlove: {
        emoji: '❤️',
        color: '#FF1493',
        label: 'In Love',
        reply: "Love is a beautiful feeling! Cherish these moments of connection 💕",
        gradient: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
        keywords: [
            'in love', 'love', 'loving', 'romance', 'romantic', 'smitten', 'infatuated',
            'crush', 'falling for', 'head over heels', 'butterflies', 'heart flutters',
            'can\'t stop thinking about', 'miss them', 'thinking of you', 'adore', 'adoration',
            'affection', 'passionate', 'chemistry', 'connection', 'soulmate', 'perfect match',
            'relationship', 'partner', 'boyfriend', 'girlfriend', 'significant other', 'date night'
        ]
    },
    confident: {
        emoji: '😎',
        color: '#4169E1',
        label: 'Confident',
        reply: "Your confidence is inspiring! You know your worth! 👑",
        gradient: 'linear-gradient(135deg, #4169E1 0%, #1E90FF 100%)',
        keywords: [
            'confident', 'confidence', 'self-assured', 'self-confident', 'assured', 'certain',
            'believe in myself', 'trust myself', 'capable', 'competent', 'skilled', 'talented',
            'I can do this', 'I got this', 'ready', 'prepared', 'strong', 'powerful',
            'unstoppable', 'fearless', 'bold', 'brave', 'courageous', 'self-esteem',
            'know my worth', 'own it', 'boss', 'killing it', 'crushing it'
        ]
    },
    guilty: {
        emoji: '😞',
        color: '#8B4513',
        label: 'Guilty',
        reply: "Guilt shows you care. Learn from it and be kind to yourself 🌱",
        gradient: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
        keywords: [
            'guilty', 'guilt', 'ashamed', 'shame', 'regret', 'regretful', 'remorse', 'remorseful',
            'feel bad', 'feeling bad about', 'shouldn\'t have', 'wish I didn\'t', 'made a mistake',
            'messed up', 'screwed up', 'let down', 'disappointed', 'apologize', 'sorry',
            'blame myself', 'my fault', 'responsible', 'accountable', 'conscience',
            'wrong', 'did wrong', 'hurt someone', 'feel terrible', 'beating myself up'
        ]
    },
    frustrated: {
        emoji: '😤',
        color: '#FF8C42',
        label: 'Frustrated',
        reply: "Frustration is temporary. Take a breath and tackle this one step at a time 💪",
        gradient: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
        keywords: [
            'frustrated', 'frustration', 'frustrating', 'annoyed', 'annoying', 'irritated', 'irritating', 'irritation',
            'fed up', 'sick of', 'tired of', 'had enough', 'can\'t stand', 'driving me crazy', 'driving me nuts',
            'stuck', 'blocked', 'can\'t get it', 'not working', 'not happening', 'nothing works',
            'aggravated', 'exasperated', 'bothered', 'irked', 'vexed', 'disgruntled',
            'impatient', 'impatience', 'restless', 'antsy', 'on edge', 'tense',
            'struggling', 'struggle', 'difficult', 'hard', 'challenging', 'tough',
            'blocked', 'stuck', 'can\'t progress', 'hitting a wall', 'dead end'
        ]
    },
    stressed: {
        emoji: '😓',
        color: '#FF6B9D',
        label: 'Stressed',
        reply: "Stress is a signal that you're pushing yourself. Take a moment to breathe and prioritize 🌸",
        gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
        keywords: [
            'stressed', 'stress', 'stressful', 'pressure', 'pressured', 'under pressure', 'deadline', 'deadlines',
            'rushed', 'rushing', 'hurried', 'hurry', 'urgent', 'urgency', 'time pressure', 'time crunch',
            'overwhelmed', 'swamped', 'buried', 'drowning', 'too much', 'can\'t handle', 'breaking point',
            'tension', 'tense', 'tight', 'strained', 'straining', 'pushed', 'pushing', 'demanding',
            'workload', 'heavy load', 'burden', 'weight', 'crushing', 'suffocating', 'squeezed',
            'racing', 'racing thoughts', 'mind racing', 'can\'t slow down', 'non-stop', 'constant',
            'burnout', 'burning out', 'exhausted', 'drained', 'depleted', 'running on empty'
        ]
    },
    irritable: {
        emoji: '😒',
        color: '#FF8C00',
        label: 'Irritable',
        reply: "Irritability often signals unmet needs. Take a moment to check in with yourself 🧘",
        gradient: 'linear-gradient(135deg, #FF8C00 0%, #FF7F50 100%)',
        keywords: [
            'irritable', 'irritability', 'cranky', 'grumpy', 'grouchy', 'snappy', 'short-tempered',
            'touchy', 'sensitive', 'on edge', 'testy', 'peevish', 'petulant', 'cantankerous',
            'easily annoyed', 'everything bothers me', 'can\'t deal', 'short fuse', 'quick to anger'
        ]
    },
    disappointed: {
        emoji: '😞',
        color: '#6B7FD7',
        label: 'Disappointed',
        reply: "Disappointment is part of growth. Your feelings are valid, and better things are ahead 🌈",
        gradient: 'linear-gradient(135deg, #6B7FD7 0%, #5A6FD8 100%)',
        keywords: [
            'disappointed', 'disappointment', 'let down', 'disheartened', 'discouraged', 'disillusioned',
            'not what I expected', 'not as good', 'underwhelmed', 'expected more', 'hoped for better',
            'crushed', 'shattered', 'broken promise', 'didn\'t work out', 'not what I wanted'
        ]
    },
    relaxed: {
        emoji: '😌',
        color: '#87CEEB',
        label: 'Relaxed',
        reply: "Relaxation is restorative. You're giving yourself the rest you deserve 🌊",
        gradient: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
        keywords: [
            'relaxed', 'relaxing', 'unwinding', 'chill', 'chilling', 'laid back', 'easygoing',
            'loose', 'loosened up', 'at ease', 'comfortable', 'cozy', 'snug', 'restful',
            'taking it easy', 'no rush', 'slow pace', 'leisurely', 'unhurried', 'mellow'
        ]
    },
    joyful: {
        emoji: '😄',
        color: '#FFD700',
        label: 'Joyful',
        reply: "Joy radiates from you! This happiness is beautiful to see! ✨",
        gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        keywords: [
            'joyful', 'joy', 'bliss', 'blissful', 'ecstatic', 'elated', 'euphoric', 'rapturous',
            'overjoyed', 'thrilled', 'delighted', 'gleeful', 'jubilant', 'exuberant', 'radiant',
            'pure joy', 'bursting with joy', 'filled with joy', 'heart full', 'soul happy'
        ]
    },
    depressed: {
        emoji: '😔',
        color: '#4A5568',
        label: 'Depressed',
        reply: "You're not alone in this. Reach out for support - there's help and hope available 💙",
        gradient: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
        keywords: [
            'depressed', 'depression', 'deep sadness', 'hopeless', 'despair', 'empty', 'numb',
            'can\'t feel', 'nothing matters', 'no point', 'worthless', 'useless', 'failure',
            'want to disappear', 'don\'t want to exist', 'dark', 'heavy', 'suffocating sadness'
        ]
    },
    peaceful: {
        emoji: '🕊️',
        color: '#98D8C8',
        label: 'Peaceful',
        reply: "Peace is a gift. You've found harmony within yourself 🕊️",
        gradient: 'linear-gradient(135deg, #98D8C8 0%, #7FB3D3 100%)',
        keywords: [
            'peaceful', 'peace', 'inner peace', 'tranquil', 'serene', 'harmonious', 'balanced',
            'centered', 'grounded', 'still', 'quiet mind', 'calm soul', 'at one', 'unified'
        ]
    },
    nervous: {
        emoji: '😟',
        color: '#C9A9DD',
        label: 'Nervous',
        reply: "Nerves show you care. Take deep breaths - you've got this! 🌸",
        gradient: 'linear-gradient(135deg, #C9A9DD 0%, #B19CD9 100%)',
        keywords: [
            'nervous', 'nervousness', 'jittery', 'jitters', 'butterflies', 'anxious', 'uneasy',
            'on edge', 'tense', 'apprehensive', 'worried', 'fearful', 'shaky', 'trembling',
            'heart racing', 'sweaty palms', 'can\'t sit still', 'restless', 'anticipating'
        ]
    },
    apathetic: {
        emoji: '😑',
        color: '#95A5A6',
        label: 'Apathetic',
        reply: "Apathy can be a sign to reconnect with what matters. What used to spark joy? 🔍",
        gradient: 'linear-gradient(135deg, #95A5A6 0%, #7F8C8D 100%)',
        keywords: [
            'apathetic', 'apathy', 'indifferent', 'uninterested', 'don\'t care', 'couldn\'t care less',
            'numb', 'empty', 'void', 'nothing matters', 'no feelings', 'emotionless', 'flat',
            'disconnected', 'detached', 'unmoved', 'unaffected', 'neutral', 'blank'
        ]
    },
    enthusiastic: {
        emoji: '🎉',
        color: '#FF6B9D',
        label: 'Enthusiastic',
        reply: "Your enthusiasm is infectious! Channel this energy into what excites you! 🚀",
        gradient: 'linear-gradient(135deg, #FF6B9D 0%, #FF1493 100%)',
        keywords: [
            'enthusiastic', 'enthusiasm', 'eager', 'zealous', 'passionate', 'fervent', 'ardent',
            'excited', 'pumped', 'hyped', 'fired up', 'energized', 'vibrant', 'dynamic',
            'full of energy', 'raring to go', 'can\'t wait', 'looking forward', 'excited about'
        ]
    },
    melancholy: {
        emoji: '🌧️',
        color: '#6C7A89',
        label: 'Melancholy',
        reply: "Melancholy has its own beauty. Sometimes we need to sit with the quiet sadness 🌧️",
        gradient: 'linear-gradient(135deg, #6C7A89 0%, #5A6A7A 100%)',
        keywords: [
            'melancholy', 'melancholic', 'pensive', 'wistful', 'nostalgic', 'bittersweet',
            'sad but beautiful', 'quiet sadness', 'gentle sadness', 'reflective', 'contemplative',
            'blue mood', 'somber', 'subdued', 'mellow sadness'
        ]
    },
    annoyed: {
        emoji: '😒',
        color: '#FF9500',
        label: 'Annoyed',
        reply: "Annoyance is valid. Sometimes things just get under our skin. Take a breath 🧘",
        gradient: 'linear-gradient(135deg, #FF9500 0%, #FF8C00 100%)',
        keywords: [
            'annoyed', 'annoying', 'irritated', 'bothered', 'irked', 'vexed', 'miffed',
            'peeved', 'riled up', 'aggravated', 'exasperated', 'fed up', 'sick of', 'tired of'
        ]
    },
    optimistic: {
        emoji: '☀️',
        color: '#FFD93D',
        label: 'Optimistic',
        reply: "Optimism is a superpower! Your positive outlook will carry you far! ☀️",
        gradient: 'linear-gradient(135deg, #FFD93D 0%, #FFA500 100%)',
        keywords: [
            'optimistic', 'optimism', 'positive outlook', 'hopeful', 'upbeat', 'sunny',
            'bright side', 'silver lining', 'glass half full', 'things will work out',
            'better days ahead', 'looking forward', 'positive thinking'
        ]
    },
    pessimistic: {
        emoji: '☁️',
        color: '#708090',
        label: 'Pessimistic',
        reply: "Pessimism can protect us, but don't let it dim your light. Small steps forward matter ☁️",
        gradient: 'linear-gradient(135deg, #708090 0%, #556B2F 100%)',
        keywords: [
            'pessimistic', 'pessimism', 'negative', 'gloomy', 'downbeat', 'doubtful',
            'skeptical', 'cynical', 'glass half empty', 'worst case', 'nothing will work',
            'doomed', 'fated', 'bound to fail', 'no hope'
        ]
    },
    satisfied: {
        emoji: '😊',
        color: '#90EE90',
        label: 'Satisfied',
        reply: "Satisfaction is contentment earned. You've found what you needed! ✨",
        gradient: 'linear-gradient(135deg, #90EE90 0%, #32CD32 100%)',
        keywords: [
            'satisfied', 'satisfaction', 'fulfilled', 'content', 'pleased', 'gratified',
            'got what I needed', 'enough', 'sufficient', 'adequate', 'good enough', 'happy with',
            'pleased with', 'content with', 'at peace with'
        ]
    },
    worried: {
        emoji: '😰',
        color: '#9370DB',
        label: 'Worried',
        reply: "Worry shows you care. Focus on what you can control, one step at a time 💜",
        gradient: 'linear-gradient(135deg, #9370DB 0%, #8B4789 100%)',
        keywords: [
            'worried', 'worry', 'worrying', 'concerned', 'anxious', 'uneasy', 'troubled',
            'apprehensive', 'fearful', 'fretting', 'stressing', 'overthinking', 'what if',
            'worried about', 'concerned about', 'can\'t stop worrying'
        ]
    }
}
;

// ========================================
// API ENDPOINTS
// ========================================

export const API_ENDPOINTS = {
    quotes: 'https://zenquotes.io/api/today',
    huggingface: 'https://api-inference.huggingface.co/models/',
    gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    spotify: {
        search: 'https://api.spotify.com/v1/search'
    }
};

// ========================================
// HELPER FUNCTIONS
// ========================================

export function validateConfig() {
    const errors = [];

    // Check Firebase config
    if (CONFIG.firebase.apiKey === 'YOUR_FIREBASE_API_KEY') {
        errors.push('Firebase API key not configured');
    }

    // Check Gemini config
    if (CONFIG.gemini.apiKey === 'YOUR_GEMINI_API_KEY') {
        errors.push('Gemini API key not configured');
    }

    // Check Hugging Face config
    if (CONFIG.huggingface.apiKey === 'YOUR_HUGGINGFACE_API_KEY') {
        errors.push('Hugging Face API key not configured');
    }

    // Check Spotify config
    if (CONFIG.spotify.token === 'YOUR_SPOTIFY_ACCESS_TOKEN') {
        errors.push('Spotify access token not configured');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}