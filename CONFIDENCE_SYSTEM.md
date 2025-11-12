# 🎯 Confidence Score System

## How It Works

MoodSync now shows you how confident it is about your detected mood, and suggests alternative moods when the confidence is low!

## Confidence Levels

### 🟢 High Confidence (70-100%)
- **Color:** Green badge
- **Meaning:** Very confident about your mood
- **Display:** Shows only the primary mood
- **Example:** "Happy 85% confident"

### 🟡 Medium Confidence (50-69%)
- **Color:** Yellow/Orange badge
- **Meaning:** Fairly confident, but you might be feeling multiple things
- **Display:** Shows primary mood + alternative moods
- **Example:** "Anxious 62% confident" + "You might also be feeling: Overwhelmed 45%, Sad 38%"

### 🔴 Low Confidence (0-49%)
- **Color:** Red badge
- **Meaning:** Multiple moods detected, hard to determine primary
- **Display:** Shows primary mood + top 3 alternative moods
- **Example:** "Confused 42% confident" + "You might also be feeling: Anxious 38%, Overwhelmed 35%, Sad 28%"

## Visual Examples

### High Confidence Entry
```
😊 Happy [85% confident]
"Love the positive energy! Keep shining ✨"
🎵 Your Happy Playlist (5 songs)
```

### Medium Confidence Entry
```
😰 Anxious [62% confident]
"You've got this. One step at a time 🌸"

ℹ️ You might also be feeling:
😵 Overwhelmed 45%
😔 Sad 38%

🎵 Your Anxious Playlist (5 songs)
```

### Low Confidence Entry
```
😕 Confused [42% confident]
"It's okay to feel uncertain. Clarity will come with time 🤔"

ℹ️ You might also be feeling:
😰 Anxious 38%
😵 Overwhelmed 35%
😔 Sad 28%

🎵 Your Confused Playlist (5 songs)
```

## How Confidence is Calculated

1. **Keyword Matching:** Counts mood-related keywords in your entry
2. **Context Analysis:** Analyzes phrases and patterns
3. **Score Distribution:** Compares primary mood score to total matches
4. **Alternative Detection:** Finds moods with at least 30% of primary score

## Benefits

✅ **Transparency:** Know how accurate the detection is
✅ **Multiple Moods:** Recognize when you're feeling complex emotions
✅ **Better Insights:** Understand your emotional state more deeply
✅ **Validation:** See alternative moods that might resonate more

## Tips for Better Detection

1. **Be Specific:** Use clear emotional words
   - ❌ "Today was okay"
   - ✅ "Today was great! I felt accomplished and proud"

2. **Write More:** Longer entries = better accuracy
   - ❌ "Feeling down" (Low confidence)
   - ✅ "Feeling down today. Everything seems overwhelming and I'm struggling to cope" (High confidence)

3. **Use Emotional Language:** Include feeling words
   - ❌ "Work was busy"
   - ✅ "Work was stressful and I felt anxious all day"

4. **Be Honest:** Authentic feelings = accurate detection
   - The AI works best when you're genuine

## Understanding Alternative Moods

When you see alternative moods, it means:
- Your entry contains mixed emotions
- You might be experiencing multiple feelings
- The AI detected significant keywords for other moods

**This is normal!** Emotions are complex. You can feel:
- Happy AND Grateful
- Sad AND Lonely
- Anxious AND Overwhelmed
- Excited AND Nervous

## Color-Coded Badges

The confidence badge color helps you quickly understand:

| Color | Range | Meaning |
|-------|-------|---------|
| 🟢 Green | 70-100% | High confidence - clear mood |
| 🟡 Yellow | 50-69% | Medium confidence - mixed feelings |
| 🔴 Red | 0-49% | Low confidence - complex emotions |

## In Your Journal History

Each entry shows:
- Primary mood with emoji
- Confidence badge (color-coded)
- Percentage score
- Easy to scan at a glance

Example:
```
😊 Happy [85%]  ← Green badge
😰 Anxious [62%]  ← Yellow badge
😕 Confused [42%]  ← Red badge
```

## Why This Matters

Understanding confidence helps you:
1. **Trust the AI** - Know when detection is accurate
2. **Explore Emotions** - See alternative moods you might be feeling
3. **Track Patterns** - Notice when you have mixed emotions
4. **Self-Reflect** - Consider if alternatives resonate with you

---

**Pro Tip:** If you see alternative moods that feel more accurate, that's valuable insight! Your emotions might be more complex than a single label can capture. 💙
