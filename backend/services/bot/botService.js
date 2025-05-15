import postService from "../post/postService.js"; // adjust path
import User from "../../models/User.js";
// Replace with your real bot user ID from Postgres:
const BOT_USER_ID = "4b4bea73-9b6f-4a65-a436-29a8d1d435bc";

// Define topics & associated message templates:
const TEMPLATES = {
    "Wellness tips": [
      "💧 Remember to stay hydrated—aim for 8 cups of water today.",
      "🌳 Take a 10-minute walk outside and breathe in some fresh air.",
      "🛁 Treat yourself to a warm bath with Epsom salts tonight.",
      "🧘 Try a 5-minute guided stretch session first thing this morning.",
      "📵 Unplug from screens for 30 minutes and read a book you love.",
      "✍️ Jot down three accomplishments from today, however small.",
      "🍎 Swap one snack for a piece of fruit or a handful of nuts.",
      "🎵 Play your favorite uplifting song and really listen to it.",
      "😴 Aim for consistent sleep—go to bed and wake up 15 minutes earlier.",
      "🌿 Add a houseplant to your workspace for cleaner air and calm vibes.",
    ],
  
    "Mindful meditation": [
      "🕯 Sit quietly and focus on your breath for 2 minutes—no judgment.",
      "🌿 Perform a 3-minute sound meditation—notice each environmental noise.",
      "🧘‍♂️ Do a 5-step body scan, from toes to crown of your head.",
      "🖼 Visualize a calm place—a beach, forest, or mountain—and stay there 3 minutes.",
      "📿 Use a simple mantra like “I am here” on each inhale and exhale.",
      "🥣 Eat one snack mindfully—tune in to every flavor and texture.",
      "🚶‍♀️ Practice walking meditation—feel each footstep and breath.",
      "📱 Try a guided app meditation for 5 minutes before bedtime.",
      "💭 Observe a single thought, let it pass without engaging.",
      "🖌 Draw or doodle freely for 3 minutes, focusing on the motion.",
    ],
  
    "Self-Care": [
      "🛌 Schedule a 20-minute power nap if you’re feeling drained.",
      "☕ Brew your favorite tea or coffee and savor it slowly.",
      "🧴 Give yourself a mini spa treatment—face mask or hand massage.",
      "🎨 Do a quick creative activity—coloring, painting, or crafting.",
      "📖 Read a chapter of a book that inspires or relaxes you.",
      "✉️ Write a kind note to yourself—remind yourself you matter.",
      "🧦 Wear your comfiest outfit for the next hour—just because.",
      "📅 Block off 30 minutes in your calendar as “me time.”",
      "📺 Watch a short, uplifting video or comedy clip.",
      "💤 Do a bedtime ritual—dim lights, gentle stretch, and deep breaths.",
    ],
  
    "Stress Management": [
      "🕹 Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s, repeat 4×.",
      "🎶 Play calming music and match your breathing to the beat.",
      "📱 Do a digital detox—silence notifications for 1 hour.",
      "🔄 Practice progressive muscle relaxation, tensing & releasing each muscle group.",
      "📋 Make a quick to-do list—get worries out of your head onto paper.",
      "⚽ Do 5 minutes of physical activity—jumping jacks or a quick jog.",
      "🌻 Look around and name 5 things you see, 4 things you touch, 3 things you hear.",
      "📝 Write down what’s stressing you—then cross off any solvable tasks.",
      "🧂 Take a moment to notice flavors—try a small bite of salty snack mindfully.",
      "🌬 Step outside and take 10 deep belly breaths under open sky.",
    ],
  
    "Emotional Healing": [
      "💌 Write an honest letter to yourself—what do you most need right now?",
      "🌅 Watch a sunrise or sunset and acknowledge one emotion you feel.",
      "🗣 Say a positive affirmation out loud: “I am worthy of care and rest.”",
      "🖼 Create a small vision board of things that bring you peace.",
      "🤲 Do a loving-kindness meditation—send goodwill to yourself and others.",
      "📆 Schedule a weekly check-in with a trusted friend or therapist.",
      "🎭 Express an emotion through a quick sketch or doodle.",
      "🛤 Visualize releasing one heavy thought as a balloon floating away.",
      "📚 Read a short story or poem that mirrors what you’re feeling.",
      "💧 Practice crying if you need to—let your tears wash stress away.",
    ],
  
    "Resilience": [
      "🛠 Recall a past challenge you overcame—write down the lesson learned.",
      "🌱 Set one small goal today—taking action builds confidence.",
      "🎤 Share a brief story of your growth with someone you trust.",
      "🐜 Break big tasks into tiny steps—tackle the first one now.",
      "🏆 Remind yourself of three strengths you have in tough times.",
      "🔄 When a setback happens, ask “What can I adjust?” instead of “Why me?”",
      "🧭 Visualize your ideal future self overcoming today’s obstacle.",
      "🧩 Tackle a small puzzle or brain teaser to shift perspective.",
      "🤝 Reach out to someone who inspires your own resilience.",
      "📖 Read a short biography of someone who persisted through hardship.",
    ],
  
    "Social Support": [
      "☎️ Call or text someone you haven’t checked in with recently.",
      "🍪 Bake or buy a small treat and share it with a neighbor or colleague.",
      "📸 Send a funny or uplifting photo to a friend “just because.”",
      "✉️ Write a thank-you note to someone who’s supported you.",
      "👂 Offer an ear—ask a friend how they’re really doing today.",
      "🌐 Join an online group or forum around a shared interest.",
      "🚶 Invite a friend for a short walk and catch up.",
      "🤗 Plan a virtual coffee date with someone far away.",
      "🎲 Organize a quick game night (even a phone-based quiz).",
      "💬 Share one positive thought in a group chat or community board.",
    ],
  
    "Gratitude": [
      "🙏 List three things you’re grateful for right now in your journal.",
      "📸 Take a photo of something small you appreciate and save it.",
      "🗓 Each morning, pick one thing yesterday you’re thankful for.",
      "🍂 Notice and name one simple pleasure in this moment.",
      "💌 Send a gratitude text to someone who made your day better.",
      "☕ Appreciate your next drink—savor its warmth or flavor fully.",
      "🖼 Write a thank-you note to yourself for something you accomplished.",
      "🌈 Spend 30 seconds looking at the sky—feel thankful for nature.",
      "🎶 Listen to a song you love—be grateful for the joy it brings.",
      "📚 Read a short gratitude story or poem online.",
    ],
  
    "Sleep Hygiene": [
      "🌙 Dim lights 30 minutes before bed; try reading instead of screens.",
      "📵 Put your phone on Do Not Disturb and place it away from your bed.",
      "🛏 Keep your room cool (around 18–20 °C) for deeper sleep.",
      "🕯 Light a lavender-scented candle (blow it out before sleep!).",
      "🥱 Do gentle stretches for 2 minutes to relax before lying down.",
      "📖 Journal 3 thoughts to clear your mind before lights out.",
      "🎧 Listen to a 5-minute sleep story or calming music track.",
      "☕ Avoid caffeine after 2 PM to help you wind down naturally.",
      "💤 Try a brief guided meditation focusing on body relaxation.",
      "⏰ Go to bed and wake up at the same times—even on weekends.",
    ],
  
    "Healthy Eating": [
      "🥗 Add an extra serving of veggies to one meal today.",
      "🚰 Start your day with a glass of water before anything else.",
      "🍇 Replace a processed snack with a handful of fruit.",
      "🥛 Swap one sugary drink for water or herbal tea.",
      "🥙 Try a new healthy recipe this week—keep it simple!",
      "🍽 Eat mindfully—chew slowly and notice every flavor.",
      "🌶 Add a pinch of spice (like cayenne) to boost metabolism.",
      "🍵 Enjoy a cup of green tea for a gentle antioxidant boost.",
      "🥄 Measure portions instead of eating straight from the package.",
      "🛒 Plan your next grocery trip—include at least 5 colorful foods.",
    ],
  };

class BotService {
  async createScheduledPost(topic) {
    if (!TEMPLATES[topic]) {
      throw new Error(`Unknown topic: ${topic}`);
    }
    // Pick a random template for this topic:
    const choices = TEMPLATES[topic];
    const content = choices[Math.floor(Math.random() * choices.length)];
    // Create the post via your existing service:
    const newPost = await postService.createPost(BOT_USER_ID, {
      content,
      media: [],                // or omit if not needed
      categories: [topic],      // tags it correctly
      anonymous: false
    });
    console.log(`Bot post created: ${newPost._id} under "${topic}"`);
    return newPost;
  }
}

export default new BotService();
