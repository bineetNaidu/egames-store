import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
const prisma = new PrismaClient();

async function main() {
  await prisma.category.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.game.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Database cleared');
  const { alice, bob } = await createUsers();
  await createGames();
  await createReviews(bob.id, alice.id);
}

async function createUsers() {
  const password = await hash('password');
  const alice = await prisma.user.create({
    data: {
      username: 'Alice',
      email: 'alice@gmail.com',
      password,
      avatar:
        'https://i.pinimg.com/564x/1f/34/da/1f34da676bcaa3b81a3ed27303fce78f.jpg',
      role: 'user',
    },
  });
  console.log(`User created: ${alice.username}`);
  const bob = await prisma.user.create({
    data: {
      username: 'Bob',
      email: 'bob@gmail.com',
      password,
      avatar:
        'https://i.pinimg.com/236x/b0/86/1e/b0861e61d7f872e983429ce37ea27ba5.jpg',
      role: 'user',
    },
  });
  console.log(`User created: ${bob.username}`);
  const admin = await prisma.user.create({
    data: {
      username: 'Admin',
      email: 'admin@gmail.com',
      password,
      avatar:
        'https://i.pinimg.com/236x/ce/d6/19/ced6190f56b555a383ca37d9ff2ea1bf.jpg',
      role: 'admin',
    },
  });
  console.log(`User created: ${admin.username}`);
  return { alice, bob, admin };
}

async function createCategory() {
  const action = await prisma.category.create({
    data: {
      name: 'Action',
    },
  });
  const adventure = await prisma.category.create({
    data: {
      name: 'Adventure',
    },
  });
  const roleplay = await prisma.category.create({
    data: {
      name: 'Role Play',
    },
  });

  const simulation = await prisma.category.create({
    data: {
      name: 'Simulation',
    },
  });

  const strategy = await prisma.category.create({
    data: {
      name: 'Strategy',
    },
  });

  const multiplayer = await prisma.category.create({
    data: {
      name: 'Multiplayer',
    },
  });

  const racing = await prisma.category.create({
    data: {
      name: 'Racing',
    },
  });

  const sports = await prisma.category.create({
    data: {
      name: 'Sports',
    },
  });

  const fighting = await prisma.category.create({
    data: {
      name: 'Fighting',
    },
  });

  console.log(`Categories created`);

  return {
    action,
    adventure,
    roleplay,
    simulation,
    strategy,
    multiplayer,
    racing,
    sports,
    fighting,
  };
}

async function createGames() {
  const { action, adventure, roleplay, simulation, strategy } =
    await createCategory();
  await prisma.game.createMany({
    data: [
      {
        name: 'The Legend of Zelda: Breath of the Wild',
        thumbnail:
          'https://upload.wikimedia.org/wikipedia/en/thumb/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg/220px-The_Legend_of_Zelda_Breath_of_the_Wild.jpg',
        info: 'Breath of the Wild is an action-adventure game set in an open world where players are tasked with exploring the kingdom of Hyrule while controlling Link.',
        details:
          'Breath of the Wild takes place at the end of the Zelda timeline in the kingdom of Hyrule. 10,000 years before the beginning of the game, the ancient Sheikah race had developed Hyrule into an advanced civilization, protected by four enormous animalistic machines called the Divine Beasts and an army of autonomous weapons called Guardians. When the evil Calamity Ganon appeared and threatened Hyrule, four great warriors were given the title of Champion, and each piloted one of the Divine Beasts to weaken Ganon while the princess with the blood of the goddess and her appointed knight fought and defeated him by sealing him away.',
        images: [
          'https://i.pinimg.com/236x/0b/54/fe/0b54fe9cb8b1f587207adbc23c055f32.jpg',
          'https://i.pinimg.com/236x/04/7e/0b/047e0b0f54805ded9fcb1a7da392bedf.jpg',
          'https://i.pinimg.com/236x/f0/3c/42/f03c42f54ed675f613287b4cbc90c6b5.jpg',
          'https://i.pinimg.com/236x/11/b7/4a/11b74a8187f16842c8fba72a487fea70.jpg',
          'https://i.pinimg.com/236x/56/57/58/5657589c760841bd5adbf2bd5cdc989e.jpg',
        ],
        tags: ['single player', 'action', 'adventure', 'puzzle'],
        price: 36,
        is_available: true,
        game_size: '1.5 GB',
        category_id: action.id,
      },
      {
        name: 'Grand Theft Auto V',
        thumbnail:
          'https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/Grand_Theft_Auto_V.png/220px-Grand_Theft_Auto_V.png',
        info: 'Grand Theft Auto V is an open world action-adventure video game developed by Rockstar North and published by Rockstar Games. It is the fifth installment in the Grand Theft Auto series and was released worldwide for Microsoft Windows, PlayStation 3, and Xbox 360 on November 18, 2013, with a North American release on November 21, 2013, a European release for Microsoft Windows and PlayStation 3 on November 22, 2013, and a Australia release for PlayStation 3 on November 23, 2013.',
        details:
          "In 2004,[i] Michael Townley, Trevor Philips, and Brad Snider partake in a failed robbery in Ludendorff, North Yankton, resulting in the first being presumed dead. Nine years later, Michael lives with his family in the city of Los Santos under the alias Michael De Santa, having made a secret agreement with the Federal Investigation Bureau (FIB)[j] agent Dave Norton to stay hidden. Across town, gangster Franklin Clinton is working for a corrupt car salesman and meets Michael while attempting to fraudulently repossess his son's car. The two later become friends. When Michael finds his wife sleeping with her tennis coach, he and Franklin chase the coach to a mansion, which Michael destroys in anger. The owner of the mansion, drug lord Martin Madrazo, demands compensation. Michael returns to a life of crime to obtain the money, enlisting Franklin as an accomplice. With the help of Michael's old friend Lester Crest, a disabled hacker, they rob a jewellery store to pay off the debt. Meanwhile, Trevor, who lives in squalor on the outskirts of Los Santos, hears of the heist and realises it was Michael's work; Trevor had believed Michael was killed in the Ludendorff heist. Trevor finds Michael and reunites with him, forcing Michael to reluctantly accept him back into his life. As time goes on, the lives of the protagonists spiral out of control. Michael's criminal behaviour prompts his family to leave him. When he later becomes a movie producer, he comes into conflict with Devin Weston, a billionaire venture capitalist and corporate raider, who attempts to shut down Michael's studio. Michael thwarts his efforts and inadvertently kills his assistant, causing Devin to vow revenge. Meanwhile, Franklin must rescue his friend Lamar Davis from his former friend and rival gangster Harold 'Stretch' Joseph, who attempts to kill them to prove himself to his new gang. Concurrently, Trevor attempts to consolidate his control over various black markets in Blaine County, waging war against The Lost outlaw motorcycle club, Latin American street gangs, rival meth dealers, private security firm Merryweather, and triad kingpin Wei Cheng.",
        images: [
          'https://i.pinimg.com/236x/e9/9f/00/e99f004b97fc6b18d95a799e5e7ed876.jpg',
          'https://i.pinimg.com/236x/94/24/07/942407d4c7df574fe9fd0b742effc4f1.jpg',
          'https://i.pinimg.com/236x/5d/9e/62/5d9e62d6f20658e7baa09ddc989409e3.jpg',
          'https://i.pinimg.com/236x/e9/8c/f7/e98cf76bf62b1f6ceff25eeb89621526.jpg',
          'https://i.pinimg.com/236x/9c/1f/66/9c1f6672fd9b0ff12c12fe5398cc9db2.jpg',
        ],
        tags: ['action', 'adventure', 'survival'],
        price: 32,
        is_available: true,
        game_size: '2.5 GB',
        category_id: simulation.id,
      },
      {
        name: 'Overwatch',
        thumbnail:
          'https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Overwatch_cover_art.jpg/220px-Overwatch_cover_art.jpg',
        info: 'Overwatch is a team-based multiplayer first-person shooter video game developed and published by Blizzard Entertainment. It is the sequel to Defense of the Ancients, and the first game in the Overwatch franchise.',
        details:
          'Overwatch is a team-based multiplayer first-person shooter video game developed and published by Blizzard Entertainment. It is the sequel to Defense of the Ancients, and the first game in the Overwatch franchise. The game was released in May 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch was released in November 2016 for PlayStation 4 and Xbox One. The game was released in November 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch was released in November 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch was released in November 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch was released in November 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch was released in November 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch was released in November 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch was released in November 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch was released in November 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch was released in November 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch was released in November 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch was released in November 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch was released in November 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch was released in November 2016 for Microsoft Windows, PlayStation 4, and Xbox One. Overwatch is a team-based multiplayer first-person shooter video game developed and published by Blizzard Entertainment. It is the sequel to Defense of the Ancients, and the first game in the Overwatch franchise.',
        images: [
          'https://i.pinimg.com/236x/9c/a1/58/9ca1587ec83895e508ba572ee8087c59.jpg',
          'https://i.pinimg.com/236x/3a/a9/22/3aa922544cc3b77e24572d4a77dc5b34.jpg',
          'https://i.pinimg.com/236x/27/57/0b/27570b07ea519029b3229c878e2de631.jpg',
          'https://i.pinimg.com/236x/66/be/a7/66bea711f2e1923143fbf578ffd3cb35.jpg',
          'https://i.pinimg.com/236x/10/05/ab/1005ab9269d8a38179b8ce1dc786b39f.jpg',
        ],
        tags: ['shoter', 'action', 'fps', 'multiplayer'],
        price: 26,
        is_available: true,
        game_size: '1.8 GB',
        category_id: strategy.id,
      },
      {
        name: 'The Last of Us',
        thumbnail:
          'https://upload.wikimedia.org/wikipedia/en/thumb/4/46/Video_Game_Cover_-_The_Last_of_Us.jpg/220px-Video_Game_Cover_-_The_Last_of_Us.jpg',
        info: 'The Last of Us is a 2013 action-adventure video game developed by Naughty Dog and published by Sony Computer Entertainment for the PlayStation 3 and Xbox 360 video game consoles. It is the first game in the The Last of Us series and the successor to the 2013 game The Last of Us: Part II.',
        details:
          "In 2013, an outbreak of a mutant Cordyceps fungus ravages the United States, transforming its human hosts into aggressive creatures known as the Infected. In the suburbs of Austin, Texas, Joel (Troy Baker) flees the chaos with his brother Tommy (Jeffrey Pierce) and daughter Sarah (Hana Hayes). As they flee, Sarah is shot by a soldier and dies in Joel's arms. Twenty years later, civilization has been decimated by the infection. Survivors live in totalitarian quarantine zones, independent settlements, and nomadic groups, leaving buildings and houses deserted. Joel works as a smuggler with his partner Tess (Annie Wersching) in the quarantine zone in the North End of Boston, Massachusetts. They hunt down Robert (Robin Atkin Downes), a black-market dealer, to recover a stolen weapons cache. Before Tess kills him, Robert reveals that he traded the cache with the Fireflies, a rebel militia opposing the quarantine zone authorities.The leader of the Fireflies, Marlene (Merle Dandridge), promises to double their cache in return for smuggling a teenage girl, Ellie (Ashley Johnson), to Fireflies hiding in the Massachusetts State House outside the quarantine zone. Joel, Tess, and Ellie sneak out in the night, but after an encounter with a government patrol, they discover Ellie is infected. Symptoms normally occur within two days, but Ellie claims she was infected three weeks earlier and that her immunity may lead to a cure. The trio make their way to their destination through hordes of the infected, but find that the Fireflies there have been killed. Tess reveals she has been bitten by an infected and, believing in Ellie's importance, sacrifices herself against pursuing soldiers so Joel and Ellie can escape. Joel decides to find Tommy, a former Firefly, in the hope that he can locate the remaining Fireflies.",
        images: [
          'https://i.pinimg.com/236x/51/5f/e1/515fe1fd1db487b3be25e0edee568a70.jpg',
          'https://i.pinimg.com/236x/85/28/78/852878970c8c0e06139026ee678c9e5e.jpg',
          'https://i.pinimg.com/236x/d7/67/a7/d767a7895c73d4d62c2ee90901bf6c8c.jpg',
          'https://i.pinimg.com/236x/30/76/a7/3076a7df464c165890c4e1420744ffb2.jpg',
          'https://i.pinimg.com/236x/94/d8/fe/94d8fe774d3dd48cb683cd63d4807b9c.jpg',
        ],
        tags: ['action', 'adventure', 'survival'],
        price: 32,
        is_available: true,
        game_size: '2.5 GB',
        category_id: adventure.id,
      },
      {
        name: 'The Witcher 3: Wild Hunt',
        thumbnail:
          'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Witcher_3_cover_art.jpg/220px-Witcher_3_cover_art.jpg',
        info: 'The Witcher 3: Wild Hunt is a 2015 action role-playing video game developed and published by CD Projekt RED. It is the third main entry in the The Witcher series.',
        details:
          "The game is set in the Continent, a fictional fantasy world based on Slavonic mythology. It is surrounded by parallel dimensions and extra-dimensional worlds. Humans, elves, dwarves, monsters and other creatures co-exist on the Continent, but non-humans are often persecuted for their differences. The Continent is caught up in a war between the empire of Nilfgaard—led by Emperor Emhyr var Emreis (Charles Dance), who invaded the Northern Kingdoms—and Redania, ruled by King Radovid V. Several locations appear, including the free city of Novigrad, the Redanian city of Oxenfurt, the no man's land of Velen, the city of Vizima (former capital of the recently conquered Temeria), the Skellige islands (home to several Norse-Gaels Viking clans) and the witcher stronghold of Kaer Morhen",
        images: [
          'https://i.pinimg.com/236x/1f/bc/53/1fbc53a47e05f8e18c1d7ed7d58e3333.jpg',
          'https://i.pinimg.com/236x/f6/98/b6/f698b6edb1388db2b38cb9d0c03eaae4.jpg',
          'https://i.pinimg.com/236x/74/71/84/747184865b02d7443f3e340e74da445a.jpg',
          'https://i.pinimg.com/236x/05/15/b5/0515b515e2c52dc26cc1082d5d1438b5.jpg',
          'https://i.pinimg.com/236x/36/28/af/3628affd950da12dca39b40f0f07a025.jpg',
        ],
        tags: ['action', 'shooting', 'role-play'],
        price: 42,
        is_available: true,
        game_size: '2.5 GB',
        category_id: roleplay.id,
      },
    ],
  });

  console.log(`Games created`);
}

async function createReviews(bobId: number, aliceId: number) {
  const games = await prisma.game.findMany({});

  games.forEach(async (game) => {
    await prisma.review.create({
      data: {
        content: 'This game is amazing',
        rating: 5,
        game_id: game.id,
        user_id: aliceId,
      },
    });
    await prisma.review.create({
      data: {
        content: 'This game is not so amazing',
        rating: 1,
        game_id: game.id,
        user_id: bobId,
      },
    });
    console.log(`Review created for ${game.name}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
