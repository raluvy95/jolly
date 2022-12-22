import { Bot, BotWithCache, Collection, config, hasGuildPermissions, Member, Message, PermissionStrings } from "@deps";
import { send } from "@utils/send.ts";

export let prefix: string;

prefix = config.prefixes[0]

const cooldowns = new Collection<string, Collection<number, number>>()

interface IJollyCommand {
    name: string;
    owner?: boolean;
    cooldown?: number;
    mod: string;
    aliases?: string[];
    permission?: PermissionStrings[]
    description?: string;
    requiredArgs?: boolean;
    usage?: string;
    run?: (message: Message, args: string[], client: BotWithCache<Bot>) => void;
}

export async function refreshCommand(): Promise<void> {
    for (const mod of Deno.readDirSync("./src/cmd")) {
        for (const { name } of Deno.readDirSync(`./src/cmd/${mod.name}`)) {
            await import(`../cmd/${mod.name}/${name}`)
        }
    }
}

export const globalCommand = new Collection<string, JollyCommand>

export class JollyCommand implements IJollyCommand {
    public name: string;
    public description: string;
    public aliases: string[];
    public permission?: PermissionStrings[]
    public owner?: boolean;
    public cooldown: number;
    public mod: string;
    public usage: string;
    public requiredArgs?: boolean;

    constructor(name: string, mod: string, options?: Partial<IJollyCommand>) {
        this.name = name;
        this.description = options?.description || "No description found"
        this.aliases = options?.aliases || ["No aliases found"]
        this.permission = options?.permission
        this.owner = options?.owner
        this.mod = mod
        this.usage = options?.usage || '';
        this.cooldown = options?.cooldown || 3
        this.requiredArgs = options?.requiredArgs || false
        this.run = options?.run || this.run
    }

    // deno-lint-ignore no-unused-vars
    run(message: Message, args: string[], client: BotWithCache<Bot>): void {

    }
}

export function addCommand(cmd: JollyCommand): void {
    switch (cmd.mod) {
        case "music":
            if (!config.plugins.music.enable) return;
            break;
        case "level":
            if (!config.plugins.levelXP.enable) return;
            break;
    }
    globalCommand.set(cmd.name, cmd);
}

function commandRunner(command: JollyCommand, message: Message, args: string[], client: BotWithCache<Bot>): void {
    try {
        command.run(message, args, client)
    } catch (error) {
        if (error instanceof Error && error.stack) {
            send(client, message.channelId, String(error.stack))
        } else
            send(client, message.channelId, String(error))

    }
}

function cooldownHandler(client: BotWithCache<Bot>, message: Message, command: JollyCommand): boolean {
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection())
    }
    const now = Date.now();
    const timestamp = cooldowns.get(command.name) as Collection<number, number>;
    const ca = (command.cooldown || 3) * 1000;
    const user = Number(message.authorId);
    if (timestamp && timestamp.has(user)) {
        const et = timestamp.get(user) as number + ca;
        if (now < et) {
            const te = (et - now) / 1000;
            send(client, message.channelId, `Command is on cooldown! \`${te.toFixed(1)}\` seconds left!`)
            return false;
        }
    }
    timestamp.set(user, now);
    setTimeout(() => {
        timestamp.delete(user);
    }, ca);
    return true;
}

function permissionChecker(command: JollyCommand, client: BotWithCache<Bot>, userid: bigint, member?: Member): boolean {
    const owners = config.owners
    if (command.owner) {
        return owners.includes(userid.toString());
    }
    else if (!member) return true
    else if (!command.permission) return true;

    return hasGuildPermissions(client, BigInt(config.guildID), member, command.permission)

}

export function findCommand(cmdName: string): JollyCommand | undefined {
    return globalCommand.get(cmdName) || globalCommand.find(m => m.aliases && m.aliases.includes(cmdName))
}

export function commandHandler(client: BotWithCache<Bot>, message: Message): boolean {
    if (!config.prefixes.some((m: string) => message.content.toLowerCase().startsWith(m), message.content.toLowerCase())) return false;
    prefix = (config.prefixes.find(m => message.content.toLowerCase().startsWith(m), message.content.toLowerCase()) as string)
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const cmdName = (args.shift() as string).toLowerCase()
    const command = findCommand(cmdName)
    if (!command) return false;
    if (command.requiredArgs && args.length < 1) { send(client, message.channelId, "Arguments is required"); return false }
    const perm = permissionChecker(command, client, message.authorId, message.member)
    if (!perm) { send(client, message.channelId, "You don't have permission to do that!"); return false }
    const cooldown = cooldownHandler(client, message, command)
    if (!cooldown) return false;
    commandRunner(command, message, args, client)
    return true;
}
