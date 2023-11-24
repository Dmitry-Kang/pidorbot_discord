# Discord "Pidor" Bot

Welcome to the Discord "Pidor" Bot! This Node.js-based bot adds a playful and random element to your Discord server by selecting a user at regular intervals and assigning them the "Pidor" role. Users can be exempted from being selected, and there are additional commands for checking the top users, voting, and more.

## Prerequisites

Before running the bot, ensure you have the required dependencies:

- Node.js installed on your system.
- Create a `.env` file in the project root with the following fields:

```env
DISCORD_TOKEN=your_discord_token
DATABASE_URL=your_database_url
```

- `DISCORD_TOKEN`: Your Discord bot token.
- `DATABASE_URL`: URL for the database storage.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Dmitry-Kang/pidorbot_discord.git
cd pidorbot_discord
```

2. Install dependencies:

```bash
npm install
```

## Running the Bot

Run the bot using the following command:

```bash
npm start
```

## Commands

- `.except @user`: Exclude a user from being randomly assigned the "Pidor" role.
- `.help`: Display a list of available commands.
- `.top`: Display the top users based on the time since they last received the "Pidor" role.
- `.vote @user`: Vote for a user to increase their chances of receiving the "Pidor" role.
- `.who`: Automatically select and assign the "Pidor" role to a user every 12 hours.

## Important Notes

- Ensure that the bot has the necessary permissions to assign roles in your Discord server.
- The bot uses a database to store information about users and their participation.

## Contribution

Contributions are welcome! If you have suggestions or want to improve the bot, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

May the "Pidor" role be ever in your favor! 🎉🤖
