import { db } from './index';

export const migrateDataIfNeeded = async () => {
  const { count } = await db.get("SELECT COUNT(*) as count FROM paragraphs") as { count: number };
  
  if (count === 0) {
    const paragraphs = [
      {
        id: "1",
        name: "School of Rock",
        content: "Those who can't do, teach. And those who can't teach, teach gym. But those who can rock, they rock hard! And I'm gonna teach these kids the only thing that truly matters: rock 'n' roll!"
      },
      {
        id: "2",
        name: "Kung Fu Panda",
        content: "There is no charge for awesomeness... or attractiveness. Yesterday is history, tomorrow is a mystery, but today is a gift. That is why it is called the present. Skadoosh!"
      },
      {
        id: "3",
        name: "Tenacious D",
        content: "With karate I'll kick your ass, here to Tiananmen Square. Oh yeah, motherfather, I'm gonna kick your effin' derriere. You broke the rules, now I'll pull out all your public hair!"
      },
      {
        id: "4",
        name: "Nacho Libre",
        content: "I bet it would be really nice to have some toast. But I ate bugs and grass to survive, so you're gonna have to trust me. These are my recreation clothes. Sometimes you wear stretchy pants in your room, it's for fun!"
      },
      {
        id: "5",
        name: "Jumanji",
        content: "I can't cry, I'm going to have to be content with just weeping. Did I die? And you guys brought me back to life? Am I some kind of zombie? I'm like a reverse bear - I have all my hair on the inside!"
      }
    ];

    await db.exec('BEGIN TRANSACTION');
    try {
      await Promise.all(
        paragraphs.map(p => 
          db.run(
            "INSERT INTO paragraphs (id, name, content) VALUES (?, ?, ?)",
            [p.id, p.name, p.content]
          )
        )
      );
      await db.exec('COMMIT');
    } catch (error) {
      await db.exec('ROLLBACK');
      throw error;
    }
  }
};