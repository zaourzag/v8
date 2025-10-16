# Migration from Klasa to Sapphire Framework

## Status: Core Infrastructure Complete

This document tracks the migration from Klasa Framework to Sapphire Framework.

## Completed

### Core Framework
- ✅ Updated package.json dependencies
  - Added `@sapphire/framework` (^5.0.0)
  - Added `@sapphire/plugin-logger` (^4.0.0)
  - Added `@sapphire/utilities` (^3.15.0)
  - Updated `discord.js` to v14.14.1
  - Removed `@aero/framework` dependency

- ✅ Created MongoDB Provider (`lib/providers/MongoDBProvider.js`)
  - Implements get, create, update, replace, delete, and has methods
  - Falls back to in-memory cache if MongoDB is not configured
  - Initialized in `Aero.js` during login

- ✅ Created Sapphire configuration (`sapphire.config.js`)
  - Configured default prefix from aero config
  - Set up regex prefix for "hey aero" format
  - Enabled case insensitivity for commands and prefixes
  - Configured logger with appropriate log levels

- ✅ Updated `lib/Aero.js`
  - Extends `SapphireClient` instead of Klasa's `Client`
  - Maintains all existing custom clients (xkcd, corona, statuspage, etc.)
  - Keeps aggregator, permissions system, and InteractionRouter
  - Stores client in Sapphire's container for global access
  - Added backwards compatible `console` getter

- ✅ Updated `lib/Permissions.js`
  - Changed event listener from `klasaReady` to `ready`
  - Updated to use Discord.js v14 `PermissionFlagsBits`
  - Updated to use Sapphire's utilities (`mergeObjects`, `makeObject`)
  - Updated to use Sapphire's command store
  - Maintains all existing permission logic

- ✅ Updated `config/discord.js`
  - Updated intents to Discord.js v14 format using `GatewayIntentBits`
  - Updated partials configuration
  - Added `MessageContent` intent for message commands

- ✅ Created base command structure (`lib/structures/AeroCommand.js`)
  - Extends Sapphire's `Command`
  - Supports both message commands (`messageRun`) and slash commands (`chatInputRun`)
  - Integrates permission checking for both command types
  - Auto-determines category from file path
  - Provides `run()` and `runSlash()` methods for subclasses

- ✅ Created example commands
  - `commands/General/ping.js` - Shows latency for both message and slash commands
  - `commands/Utility/echo.js` - Demonstrates argument handling for both command types

- ✅ Created event listeners
  - `listeners/ready.js` - Handles bot ready event, initializes permissions
  - `listeners/interactionCreate.js` - Routes custom interactions through InteractionRouter

- ✅ Updated entry points
  - Updated `src/index.js` to use Sapphire's Logger
  - Updated `src/launch.js` to use `client.logger`
  - Updated `lib/Aggregator.js` to use Sapphire's Logger

## Pending Migration

### Extensions (Requires Discord.js v14 Migration)
The following extensions use `Structures.extend()` which was removed in Discord.js v14:
- `lib/extensions/Message.js`
- `lib/extensions/Guild.js`
- `lib/extensions/GuildMember.js`
- `lib/extensions/User.js`
- `lib/extensions/TextChannel.js`
- `lib/extensions/GuildReactionCollector.js`

**Solution**: These need to be rewritten using prototype extension or composition patterns.

### Settings Schema (Requires Reimplementation)
- `lib/settings.js` uses Klasa's schema system which doesn't exist in Sapphire
- **Solution**: Either create a custom schema system or use a different approach for guild/member/user settings

### Existing Commands (127+ files)
All commands in `src/commands/` need to be migrated to extend `AeroCommand`:
- Configuration commands (17 files)
- Admin commands
- Fun commands  
- Moderation commands
- Social commands
- Util commands

**Migration Pattern**:
```javascript
// Old (Klasa)
const { Command } = require('@aero/framework');
class MyCommand extends Command {
  async run(message, [...args]) { }
}

// New (Sapphire)
const AeroCommand = require('../../lib/structures/AeroCommand');
class MyCommand extends AeroCommand {
  async run(message, args) { }
  async runSlash(interaction) { }
  registerApplicationCommands(registry) { }
}
```

### Event Listeners (25 files)
All events in `src/events/` need to be migrated to Sapphire listeners:
- Already migrated: `interactionCreate`, `ready` (formerly `klasaReady`)
- Remaining: 23 event files

**Migration Pattern**:
```javascript
// Old (Klasa)
const { Event } = require('@aero/framework');
class MyEvent extends Event {
  async run(...args) { }
}

// New (Sapphire)
const { Listener } = require('@sapphire/framework');
class MyEvent extends Listener {
  constructor(context, options) {
    super(context, { ...options, event: 'eventName' });
  }
  async run(...args) { }
}
```

### Arguments (15 files)
Klasa's argument system is different from Sapphire's Args system.

**Migration needed for**:
- `src/arguments/*.js` files

### Other Pieces
- **Tasks** (2 files): `endTempban.js`, `reminder.js`
- **Monitors** (13 files): Various anti-spam and moderation monitors
- **Inhibitors** (3 files): Permission checks, deprecated commands, social features
- **Finalizers** (1 file): Message cleanup
- **PreMonitors** (1 file): PluralKit integration
- **PostMonitors** (1 file): Message tracking

### Structures
Base classes that need migration:
- `lib/structures/ModerationCommand.js`
- `lib/structures/MultiModerationCommand.js`
- `lib/structures/LGBTImageCommand.js`
- `lib/structures/NekosLifeCommand.js`
- `lib/structures/BaseBoardEvent.js`
- `lib/structures/StarEvent.js`
- `lib/structures/LemonEvent.js`

### Utilities
- `lib/GuildLogger.js` - Uses `Duration` from @aero/framework
- `lib/extensions/TextChannel.js` - Uses `sleep` utility

### Language System
- `src/languages/en-US.js` - Uses Klasa's Language class

## Testing

Once the core infrastructure is in place, test with:

```bash
# Install dependencies
npm install

# Start the bot
npm start
```

## Notes

- The migration maintains backwards compatibility where possible
- Existing command files will need individual migration
- Settings system will need to be completely reimplemented
- Extensions will need Discord.js v14 compatible implementations
- All custom utilities from @aero/framework will need replacements or local implementations
